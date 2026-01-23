import api from "../api";

export interface SummaryParams {
  start: string;
  end: string;
  pevId?: string;
  wasteId?: string;
}

export async function getDashboardSummary(params: SummaryParams) {
  return api.get("/collections/dashboard/summary", {
    params,
  });
}
