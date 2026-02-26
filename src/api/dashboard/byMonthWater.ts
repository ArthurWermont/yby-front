import api from "../api";
import { ByMonthParams } from "./byMonth";

export type WaterDataType = {
  month: string;
  totalLitros: number;
};

export async function getCollectionsByMonthWater(
  params: ByMonthParams
): Promise<WaterDataType[]> {
  const {data} = await api.get("/collections/dashboard/by-water-month", {
    params,
  });

  return data;
}
