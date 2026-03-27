import api from "../api";
import type { SummaryParams } from "./summary";

export async function getDashboardSummaryOil(params: SummaryParams) {
  return api.get("/collections/dashboard/summary-oil", {
    params,
  });
}