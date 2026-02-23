import type { ReactNode } from "react";

export interface TableData {
  id: string;
  documentId: string;
  pev: string;
  waste: string;
  weight: string;
  hasAvaria: "Sim" | "Não";
  cooperative: string;
  imageAvaria: string;
  imageColectorUrl: string;
  wastesIds: string[];
  createdAt: string;
  actions: ReactNode;
}

export interface ColumnData {
  dataKey: keyof TableData;
  label: string;
  numeric?: boolean;
  width?: number;
}

export type FetchDataResult = (args: { page: number }) => Promise<{
  data: TableData[];
  pagination: Pagination;
}>;

export interface Pagination {
  limit: number;
  start: number;
  total: number;
}
