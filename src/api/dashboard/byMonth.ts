import api from "../api";

export interface ByMonthParams {
  start: string;
  end: string;
  pevId?: string;
  wasteId?: string;
}

export type WeightDataType = {
  month: string;
  totalWeight: number;
};

export async function getCollectionsByMonth(
  params: ByMonthParams
): Promise<WeightDataType[]> {
  const { data } = await api.get("/collections/dashboard/by-month", {
    params,
  });

  return data;
}
