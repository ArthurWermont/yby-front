import api from "../api";
import { SummaryParams } from "./summary";

export async function getDashboardSummaryWater(params: SummaryParams) {
  return api.get("/collections/dashboard/summary-water", {
    params,
  });
}