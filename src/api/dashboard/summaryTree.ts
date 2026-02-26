import api from "../api";
import { SummaryParams } from "./summary";

export async function getDashboardSummaryTree(params: SummaryParams) {
  return api.get("/collections/dashboard/summary-tree", {
    params,
  });
}