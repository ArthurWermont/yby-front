import api from "../api";
import type { ByMonthParams } from "./byMonth";

export type RecoveredValueDataType = {
  month: string;
  value: number;
};

export async function getCollectionsByMonthRecoveredValue(
  params: ByMonthParams
): Promise<RecoveredValueDataType[]> {
  const response = await api.get("/collections/dashboard/by-recoveredValue-month", {
    params,
  });
  return response.data;
}
