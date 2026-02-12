import { useCallback, useEffect, useRef, type FC } from "react";
import { TableVirtuoso } from "react-virtuoso";
import { useImmer } from "use-immer";
import { useReportsContext } from "../context";
import { rowContent, virtuosoTableComponents } from "./config";
import { Footer } from "./footer";
import { Header } from "./header";
import type { FetchDataResult, TableData } from "./interfaces";

interface ReportTableProps {
  fetchData: FetchDataResult;
}

export const ReportTable: FC<ReportTableProps> = (props) => {
  const { search, lastSearch } = useReportsContext();

  const [{ data, loading, hasMore, page }, setState] = useImmer({
    data: [] as TableData[],
    loading: false,
    hasMore: true,
    page: 1,
  });

  const stateRef = useRef({ data, loading, hasMore, page });
  stateRef.current = { data, loading, hasMore, page };

  const virtuosoRef = useRef(null);

  const fetchData = useCallback(async (pageNumber: number) => {
    const currentState = stateRef.current;

    if (currentState.loading || !currentState.hasMore) return;

    setState((draft) => {
      draft.loading = true;
    });

    const { data: newData, pagination } = await props.fetchData({
      page: pageNumber,
    });

    setState((draft) => {
      if (pageNumber === 1) {
        draft.data = newData;
      } else {
        draft.data.push(...newData);
      }

      draft.hasMore = draft.data.length < pagination.total;
      draft.page = pageNumber;
      draft.loading = false;
    });
  }, []);

  const loadMore = useCallback(async () => {
    const currentState = stateRef.current;

    if (!currentState.loading && currentState.hasMore) {
      const nextPage = currentState.page + 1;
      fetchData(nextPage);
    }
  }, [fetchData]);

  useEffect(() => {
    fetchData(1);
  }, []);

  useEffect(() => {
    setState((draft) => {
      draft.data = [];
      draft.loading = false;
      draft.hasMore = true;
      draft.page = 1;
    });

    fetchData(1);
  }, [search]);

  return (
    <TableVirtuoso
      ref={virtuosoRef}
      totalCount={data.length}
      data={data}
      components={virtuosoTableComponents}
      itemContent={rowContent}
      endReached={loadMore}
      overscan={10}
      fixedHeaderContent={Header}
      fixedFooterContent={() => (
        <Footer data={data} loading={loading} hasMore={hasMore} />
      )}
    />
  );
};
