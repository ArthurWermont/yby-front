import api from "../api";
import type { SummaryParams } from "./summary";

export async function getDashboardSummaryRecoveredValue(params: SummaryParams) {
  return api.get("/collections/dashboard/summary-recoveredValue", {
    params,
  });
}