import api from "../api";
import type { SummaryParams } from "./summary";

export async function getDashboardSummaryLandFillSpace(params: SummaryParams) {
  return api.get("/collections/dashboard/summary-land-fill-space", {
    params,
  });
}