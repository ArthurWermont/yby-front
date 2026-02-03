import { Paper } from "@mui/material";
import { useCallback, useEffect, useRef, type FC } from "react";
import { TableVirtuoso } from "react-virtuoso";
import { useImmer } from "use-immer";
import { useReportsContext } from "../context";
import { rowContent, virtuosoTableComponents } from "./config";
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

  const virtuosoRef = useRef(null);

  const fetchData = async (pageNumber: number, force = false) => {
    if (!force && (loading || !hasMore)) return;

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

      draft.loading = false;
    });
  };

  const loadMore = useCallback(async () => {
    if (!loading && hasMore) {
      const nextPage = page + 1;
      setState((draft) => {
        draft.page = nextPage;
      });
      await fetchData(nextPage);
    }
  }, [loading, hasMore, page, fetchData]);

  useEffect(() => {
    fetchData(1);
  }, []);

  useEffect(() => {
    if (!lastSearch) return;

    setState((draft) => {
      draft.page = 1;
      draft.hasMore = true;
      draft.loading = false;
      draft.data = [];
    });

    fetchData(1, true);
  }, [search, lastSearch]);

  return (
    <Paper style={{ height: 400, width: "100%", marginTop: 30 }}>
      <TableVirtuoso
        ref={virtuosoRef}
        totalCount={data.length}
        data={data}
        fixedHeaderContent={Header}
        components={virtuosoTableComponents}
        itemContent={rowContent}
        endReached={loadMore}
        overscan={10}
      />
    </Paper>
  );
};
