import moment from "moment";
import {
  createContext,
  type FC,
  useContext,
  type PropsWithChildren,
  useState,
} from "react";
import type {
  WeightDataType,
  WaterDataType,
  EnergyDataType,
  OilDataType,
  TreeDataType,
  IByWaste,
} from "../api/dashboard";

interface DashboardReport {
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
interface IContext {
  mode: "admin" | "client" | "manager";
  pev: string;
  pevName: string;
  selectedPevs: string[];
  selectedPevNames: string[];
  waste: string;
  wasteName: string;
  startDate: string;
  endDate: string;
  changeFilters: (args: Partial<IState>) => void;

  report: DashboardReport;
  setReport: (patch: Partial<DashboardReport>) => void;
  clearReport: () => void;
}

type IState = Omit<
  IContext,
  "changeFilters" | "mode" | "report" | "setReport" | "clearReport"
>;

const Context = createContext<IContext>({} as IContext);

export const ContextProvider = Context.Provider;

export const useDashboardContext = () => {
  return useContext(Context);
};

export const DashboardProvider: FC<
  PropsWithChildren<{ mode: "client" | "admin" | "manager" }>
> = ({ children, mode }) => {
  const [filters, setFilters] = useState<IState>(() => {
    return {
      pev: "",
      pevName: "",
      selectedPevs: [],
      selectedPevNames: [],
      waste: "",
      wasteName: "",
      startDate: moment().subtract(6, "months").format("YYYY-MM-DD"),
      endDate: moment().format("YYYY-MM-DD"),
    };
  });

  const changeFilters = (args: Partial<IState>) => {
    setFilters({ ...filters, ...args });
    clearReport();
  };

  const [report, setReportstate] = useState<DashboardReport>({});

  const setReport = (patch: Partial<DashboardReport>) => {
    setReportstate((prev) => ({ ...prev, ...patch }));
  };

  const clearReport = () => setReportstate({});

  return (
    <ContextProvider
      value={{
        mode,
        pev: filters.pev,
        pevName: filters.pevName,
        selectedPevs: filters.selectedPevs,
        selectedPevNames: filters.selectedPevNames,
        waste: filters.waste,
        wasteName: filters.wasteName,
        startDate: filters.startDate,
        endDate: filters.endDate,
        changeFilters,
        report,
        setReport,
        clearReport,
      }}
    >
      {children}
    </ContextProvider>
  );
};
