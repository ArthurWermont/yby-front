import { Document } from "@react-pdf/renderer";

import type {
  EnergyDataType,
  IByWaste,
  OilDataType,
  TreeDataType,
  WaterDataType,
  WeightDataType,
} from "../api/dashboard";

import { registerReportFonts } from "./pdf-report/fonts";
import { BreakdownPage } from "./pdf-report/pages/BreakdownPage";
import { CoverPage } from "./pdf-report/pages/CoverPage";
import { IndicatorsPage } from "./pdf-report/pages/IndicatorsPage";
import { ShareableImpactPage } from "./pdf-report/pages/ShareableImpactPage";

interface DashboardPDFProps {
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
}

const DashboardPDF = ({
  mode,
  startDate,
  endDate,
  selectedPevs,
  selectedPevNames,
  waste,
  wasteName,

  weightByMonth = [],
  waterByMonth = [],
  energyByMonth = [],
  oilBymonth = [],
  treeByMonth = [],

  weightSummary,
  waterSummary,
  energySummary,
  oilSummary,
  treeSummary,
  landFillSpaceSummary,
  cO2Summary,
  cO2SummaryValue,
  recoveredValueSummary,
  dataResiduos = [],
}: DashboardPDFProps) => {
  registerReportFonts();

  const reportProps = {
    mode,
    startDate,
    endDate,
    selectedPevs,
    selectedPevNames,
    waste,
    wasteName,
    weightByMonth,
    waterByMonth,
    energyByMonth,
    oilBymonth,
    treeByMonth,
    weightSummary,
    waterSummary,
    energySummary,
    oilSummary,
    treeSummary,
    landFillSpaceSummary,
    cO2Summary,
    cO2SummaryValue,
    recoveredValueSummary,
    dataResiduos,
  };

  return (
    <Document>
      <CoverPage {...reportProps} />
      <IndicatorsPage {...reportProps} />
      <BreakdownPage {...reportProps} />
      <ShareableImpactPage {...reportProps} />
    </Document>
  );
};

export default DashboardPDF;
