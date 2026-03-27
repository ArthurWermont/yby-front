import api from "../api";
import type { ByMonthParams } from "./byMonth";

export type EnergyDataType = {
  month: string;
  mwh: number;
};

export async function getCollectionsByMonthEnergy(
  params: ByMonthParams,
): Promise<EnergyDataType[]> {
  const { data } = await api.get("/collections/dashboard/by-energy-month", {
    params,
  });
  return data;
}
