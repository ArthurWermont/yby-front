import api from "../api";
import type { ByMonthParams } from "./byMonth";

export type TreeDataType = {
  month: string;
  value: number;
};

export async function getCollectionsByMonthTree(
  params: ByMonthParams
): Promise<TreeDataType[]> {
  const response = await api.get("/collections/dashboard/by-tree-month", {
    params,
  });
  return response.data;
}
