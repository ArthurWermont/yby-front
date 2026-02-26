import { memo, useCallback, useEffect, useRef, useState, type FC } from "react";
import { TableVirtuoso } from "react-virtuoso";
import {
  catchError,
  debounceTime,
  distinctUntilChanged,
  filter,
  map,
  merge,
  of,
  scan,
  startWith,
  Subject,
  switchMap,
  takeUntil,
} from "rxjs";
import { useReportsContext, type IContext } from "../context";
import { rowContent, virtuosoTableComponents } from "./config";
import { Footer } from "./footer";
import { Header } from "./header";
import type { FetchDataResult, Pagination, TableData } from "./interfaces";

interface ReportTableProps {
  fetchData: FetchDataResult;
}

// Tipos para as ações do stream
type TableAction =
  | { type: "INITIAL_LOAD" }
  | { type: "LOAD_MORE" }
  | { type: "SEARCH_CHANGED"; search: IContext["search"] }
  | { type: "RETRY" };

// Estado gerenciado pelo RxJS
export interface TableState {
  data: TableData[];
  loading: boolean;
  hasMore: boolean;
  currentPage: number;
  error: Error | null;
  pagination: Pagination | null;
}

const INITIAL_STATE: TableState = {
  data: [],
  loading: false,
  hasMore: true,
  currentPage: 1,
  error: null,
  pagination: null,
};

const OVERSCAN_COUNT = 10;
const SEARCH_DEBOUNCE_MS = 300;

export const ReportTable: FC<ReportTableProps> = memo(({ fetchData }) => {
  const { search } = useReportsContext();

  // Estado local para o React (recebe updates do stream)
  const [state, setState] = useState<TableState>(INITIAL_STATE);

  // Streams do RxJS
  const actionSubject = useRef(new Subject<TableAction>());
  const destroySubject = useRef(new Subject<void>());
  const virtuosoRef = useRef(null);

  // Função de busca que retorna um Observable
  const fetchData$ = useCallback(
    (page: number, isInitial: boolean = false) => {
      return of({ page, isInitial }).pipe(
        switchMap(async ({ page }) => {
          const result = await fetchData({ page });
          return {
            ...result,
            isInitial,
          };
        }),
        map((result) => ({
          type: "FETCH_SUCCESS" as const,
          payload: {
            data: result.data,
            pagination: result.pagination,
            isInitial: result.isInitial,
          },
        })),
        catchError((error) =>
          of({
            type: "FETCH_ERROR" as const,
            payload: { error },
          }),
        ),
      );
    },
    [fetchData],
  );

  // Configuração do stream principal
  useEffect(() => {
    const action$ = actionSubject.current.pipe(
      takeUntil(destroySubject.current),
    );

    // Stream de busca
    const search$ = action$.pipe(
      filter(
        (
          action,
        ): action is { type: "SEARCH_CHANGED"; search: IContext["search"] } =>
          action.type === "SEARCH_CHANGED",
      ),
      debounceTime(SEARCH_DEBOUNCE_MS),
      distinctUntilChanged((prev, curr) => prev.search === curr.search),
      map(() => ({ type: "INITIAL_LOAD" }) as const),
    );

    // Combina todas as ações
    const state$ = merge(
      action$.pipe(
        filter(
          (
            action,
          ): action is { type: "INITIAL_LOAD" | "LOAD_MORE" | "RETRY" } =>
            ["INITIAL_LOAD", "LOAD_MORE", "RETRY"].includes(action.type),
        ),
      ),
      search$,
    ).pipe(
      // Usa o estado atual para decidir a página
      scan(
        (acc, action) => {
          if (action.type === "INITIAL_LOAD" || action.type === "RETRY") {
            return { ...acc, currentPage: 1 };
          }
          if (action.type === "LOAD_MORE" && acc.hasMore && !acc.loading) {
            return { ...acc, currentPage: acc.currentPage + 1 };
          }
          return acc;
        },
        { currentPage: 1, hasMore: true, loading: false } as Pick<
          TableState,
          "currentPage" | "hasMore" | "loading"
        >,
      ),

      // Executa a busca
      switchMap(({ currentPage, hasMore, loading }) => {
        if (loading || !hasMore) return of(null);

        setState((prev) => ({ ...prev, loading: true, error: null }));

        return fetchData$(currentPage, currentPage === 1).pipe(
          startWith({ type: "FETCH_START" } as const),
        );
      }),

      // Atualiza o estado
      scan((currentState, action) => {
        if (!action) return currentState;

        switch (action.type) {
          case "FETCH_START":
            return { ...currentState, loading: true };

          case "FETCH_SUCCESS":
            const { data: newData, pagination, isInitial } = action.payload;
            return {
              ...currentState,
              data: isInitial ? newData : [...currentState.data, ...newData],
              pagination,
              hasMore: pagination.start < pagination.total,
              loading: false,
              error: null,
              currentPage: isInitial ? 1 : currentState.currentPage,
            };

          case "FETCH_ERROR":
            return {
              ...currentState,
              loading: false,
              error: action.payload.error,
            };

          default:
            return currentState;
        }
      }, INITIAL_STATE),
    );

    // Subscription
    const subscription = state$.subscribe(setState);

    // Ações iniciais
    actionSubject.current.next({ type: "INITIAL_LOAD" });

    return () => {
      subscription.unsubscribe();
      destroySubject.current.next();
      destroySubject.current.complete();
    };
  }, [fetchData$]);

  // Observa mudanças na busca
  useEffect(() => {
    actionSubject.current.next({ type: "SEARCH_CHANGED", search });
  }, [search]);

  const loadMore = useCallback(() => {
    if (!state.loading && state.hasMore) {
      actionSubject.current.next({ type: "LOAD_MORE" });
    }
  }, [state.loading, state.hasMore]);

  const retry = useCallback(() => {
    actionSubject.current.next({ type: "RETRY" });
  }, []);

  // Scroll to top when search changes
  useEffect(() => {
    if (virtuosoRef.current && state.data.length > 0) {
      // @ts-ignore
      virtuosoRef.current.scrollToIndex({
        index: 0,
        align: "start",
        behavior: "smooth",
      });
    }
  }, [search, state.data.length]);

  if (state.error) {
    return (
      <div className="error-container">
        <p>Erro ao carregar dados: {state.error.message}</p>
        <button onClick={retry}>Tentar novamente</button>
      </div>
    );
  }

  return (
    <TableVirtuoso
      ref={virtuosoRef}
      totalCount={state.data.length}
      data={state.data}
      components={virtuosoTableComponents}
      itemContent={rowContent}
      endReached={loadMore}
      overscan={OVERSCAN_COUNT}
      fixedHeaderContent={Header}
      fixedFooterContent={() => <Footer state={state} />}

      //  // Melhorias de performance
      // increaseViewportBy={{ top: 20, bottom: 20 }}
      // useWindowScroll={false}
    />
  );
});

// function filter<T>(predicate: (value: T) => boolean) {
//   return (source: any) => source.pipe(
//     (obs: any) => obs.filter(predicate)
//   );
// }
