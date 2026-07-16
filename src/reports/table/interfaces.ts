import type { ReactNode } from "react";

export type ReportCollectionItem = {
  id?: number;
  documentId?: string;
  order?: number;
  waste?: {
    id?: number;
    name?: string;
  };
  weight_kg?: number;
  original_quantity?: number;
  original_unit?: "kg" | "L";
  collector_volume_breakdown?: any;
  colector?: {
    url?: string;
  };
};

export type ReportItemImage = {
  order: number;
  wasteName: string;
  weightKg?: number;
  originalQuantity?: number;
  originalUnit?: string;
  collectorVolumeBreakdown?: any;
  imageColector?: string;
};

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
  collection_date: string;
  items?: ReportCollectionItem[];
  itemImages?: ReportItemImage[];
  actions: ReactNode | null;
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
