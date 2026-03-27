import api from "../api";
import type { ByMonthParams } from "./byMonth";

export type OilDataType = {
  month: string;
  litros: number;
};

export async function getCollectionsByMonthOil(
  params: ByMonthParams
): Promise<OilDataType[]> {
  const response = await api.get("/collections/dashboard/by-oil-month", {
    params,
  });
  return response.data;
}
