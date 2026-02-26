import api from "../api";

interface ByWasteParams {
  start: string;
  end: string;
  pevId?: string;
  wasteId?: string
}

export interface IByWaste {
  name: string;
  value: number;
}

export async function getWasteDistribution(params: ByWasteParams) {
  return api.get("/collections/dashboard/by-waste", {
    params,
  });
}
