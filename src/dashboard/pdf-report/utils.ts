import { format } from "date-fns";

// formatNumber(40341.31)
// 40.341,31
export const formatNumber = (value?: number) => {
  return (value ?? 0).toLocaleString("pt-BR", {
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  });
};

export const formatInteger = (value?: number) => {
  return Math.round(value ?? 0).toLocaleString("pt-BR");
};

// formatCurrency(3123.27)
// R$ 3.123,27
export const formatCurrency = (value?: number) => {
  return (value ?? 0).toLocaleString("pt-BR", {
    style: "currency",
    currency: "BRL",
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  });
};

// formatCompactNumber(21250065)
// 21,25 mi
export const formatCompactNumber = (value?: number) => {
  const number = value ?? 0;

  if (number >= 1_000_000) {
    return `${(number / 1_000_000).toLocaleString("pt-BR", {
      minimumFractionDigits: 2,
      maximumFractionDigits: 2,
    })} mi`;
  }

  if (number >= 1_000) {
    return `${(number / 1_000).toLocaleString("pt-BR", {
      minimumFractionDigits: 1,
      maximumFractionDigits: 1,
    })} mil`;
  }

  return formatNumber(number);
};

// formatPeriod(startDate, endDate)
// 16/12/2025 até 16/06/2026
export const formatPeriod = (startDate: string, endDate: string) => {
  return `${format(new Date(`${startDate}T00:00:00`), "dd/MM/yyyy")} até ${format(
    new Date(`${endDate}T23:59:59`),
    "dd/MM/yyyy",
  )}`;
};

export const getReportTitle = (mode: "admin" | "client" | "manager") => {
  if (mode === "admin") return "Relatório Geral de Impacto";
  if (mode === "manager") return "Relatório de Impacto do Gestor";
  return "Relatório de Impacto do Cliente";
};

export const getContextLabel = ({
  mode,
  selectedPevNames = [],
}: {
  mode: "admin" | "client" | "manager";
  selectedPevNames?: string[];
}) => {
  const names = selectedPevNames.length > 0 ? selectedPevNames.join(", ") : "";

  if (mode === "admin") {
    return names || "Todos os clientes";
  }

  if (mode === "manager") {
    return names || "Todos os clientes vinculados";
  }

  return names || "Cliente selecionado";
};