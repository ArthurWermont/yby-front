import api from "../api";
import { SummaryParams } from "./summary";

export async function getDashboardSummaryEnergy(params: SummaryParams) {
  return api.get("/collections/dashboard/summary-energy", {
    params,
  });
}