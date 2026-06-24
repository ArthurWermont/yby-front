import type {
  EnergyDataType,
  IByWaste,
  OilDataType,
  TreeDataType,
  WaterDataType,
  WeightDataType,
} from "../../api/dashboard";

export type DashboardReportPdfProps = {
  mode: "admin" | "client" | "manager";
  startDate: string;
  endDate: string;
  selectedPevs?: string[];
  selectedPevNames?: string[];
  waste?: string;
  wasteName?: string;

  weightByMonth?: WeightDataType[];
  waterByMonth?: WaterDataType[];
  energyByMonth?: EnergyDataType[];
  oilBymonth?: OilDataType[];
  treeByMonth?: TreeDataType[];

  weightSummary?: number;
  waterSummary?: number;
  landFillSpaceSummary?: number;
  cO2Summary?: number;
  cO2SummaryValue?: number;
  recoveredValueSummary?: number;
  energySummary?: number;
  oilSummary?: number;
  treeSummary?: number;
  dataResiduos?: IByWaste[];
};