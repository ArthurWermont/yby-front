import api from "../api";
import type { SummaryParams } from "./summary";

export async function getDashboardSummaryCO2(params: SummaryParams) {
  return api.get("/collections/dashboard/summary-co2", {
    params,
  });
}