import {
  formatCompactNumber,
  formatCurrency,
  formatInteger,
  formatNumber,
  formatPeriod,
  getContextLabel,
  getReportTitle,
} from "../pdf-report/utils";

export {
  formatCompactNumber,
  formatCurrency,
  formatInteger,
  formatNumber,
  formatPeriod,
  getContextLabel,
  getReportTitle,
};

export const formatMonthsCount = (count: number) => {
  if (count === 1) return "1 mês";
  return `${count} meses`;
};

export const translateMonth = (month: string) => {
  const months: Record<string, string> = {
    Jan: "Jan",
    Feb: "Fev",
    Mar: "Mar",
    Apr: "Abr",
    May: "Mai",
    Jun: "Jun",
    Jul: "Jul",
    Aug: "Ago",
    Sep: "Set",
    Oct: "Out",
    Nov: "Nov",
    Dec: "Dez",
  };

  return months[month] || month;
};

export const getSafeWasteName = (wasteName?: string) => {
  return wasteName || "Todos os resíduos";
};

export const getShortContextLabel = ({
  context,
  maxLength = 34,
}: {
  context: string;
  maxLength?: number;
}) => {
  if (context.length <= maxLength) return context;
  return `${context.slice(0, maxLength - 3)}...`;
};