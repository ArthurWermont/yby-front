import { Page, StyleSheet, Text, View } from "@react-pdf/renderer";

import { MonthlyTable } from "../components/MonthlyTable";
import { ReportFooter } from "../components/ReportFooter";
import { ReportHeader } from "../components/ReportHeader";
import { SectionTitle } from "../components/SectionTitle";
import { WasteDistribution } from "../components/WasteDistribution";
import { colors, radius, spacing } from "../tokens";
import type { DashboardReportPdfProps } from "../types";
import {
  formatCurrency,
  formatNumber,
  formatPeriod,
  getContextLabel,
} from "../utils";

const styles = StyleSheet.create({
  page: {
    backgroundColor: colors.beige50,
    paddingTop: 30,
    paddingRight: 42,
    paddingBottom: 70,
    paddingLeft: 42,
    fontFamily: "Helvetica",
  },

  content: {
    flexGrow: 1,
  },

  topSection: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginBottom: 12,
  },

  distributionBox: {
    width: "58%",
  },

  summaryBox: {
    width: "38%",
    backgroundColor: colors.beige100,
    borderWidth: 1,
    borderColor: colors.border,
    borderRadius: radius.lg,
    padding: spacing.md,
  },

  summaryEyebrow: {
    fontSize: 8,
    color: colors.forest700,
    fontWeight: 700,
    letterSpacing: 1.2,
    textTransform: "uppercase",
    marginBottom: 10,
  },

  summaryRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    borderBottomWidth: 1,
    borderBottomColor: colors.border,
    paddingBottom: 6,
    marginBottom: 6,
  },

  summaryLabel: {
    width: "54%",
    fontSize: 7.5,
    color: colors.brown500,
    lineHeight: 1.25,
  },

  summaryValue: {
    width: "44%",
    fontSize: 7.5,
    color: colors.brown900,
    fontWeight: 700,
    textAlign: "right",
    lineHeight: 1.25,
  },

  tableSection: {
    marginTop: 4,
  },

  noteBox: {
    marginTop: 8,
    backgroundColor: colors.white,
    borderWidth: 1,
    borderColor: colors.border,
    borderRadius: radius.md,
    padding: 9,
  },

  noteText: {
    fontSize: 8,
    color: colors.brown500,
    lineHeight: 1.35,
  },
});

type SummaryRowProps = {
  label: string;
  value: string;
};

function SummaryRow({ label, value }: SummaryRowProps) {
  return (
    <View style={styles.summaryRow}>
      <Text style={styles.summaryLabel}>{label}</Text>
      <Text style={styles.summaryValue}>{value}</Text>
    </View>
  );
}

export function BreakdownPage({
  mode,
  startDate,
  endDate,
  selectedPevNames = [],
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
}: DashboardReportPdfProps) {
  const period = formatPeriod(startDate, endDate);

  const context = getContextLabel({
    mode,
    selectedPevNames,
  });

  const monthsCount = weightByMonth.length;

  return (
    <Page size="A4" style={styles.page}>
      <View style={styles.content}>
        <ReportHeader
          title="Distribuição e evolução"
          period={period}
          context={context}
        />

        <SectionTitle
          eyebrow="Composição do período"
          title="Distribuição por resíduo"
          description="Participação percentual dos tipos de resíduos registrados no período selecionado."
        />

        <View style={styles.topSection}>
          <View style={styles.distributionBox}>
            <WasteDistribution data={dataResiduos} />
          </View>

          <View style={styles.summaryBox}>
            <Text style={styles.summaryEyebrow}>Resumo técnico</Text>

            <SummaryRow
              label="Peso total coletado"
              value={`${formatNumber(weightSummary)} kg`}
            />

            <SummaryRow
              label="Água economizada"
              value={`${formatNumber(waterSummary)} L`}
            />

            <SummaryRow
              label="Energia economizada"
              value={`${formatNumber(energySummary)} MWh`}
            />

            <SummaryRow
              label="CO2e evitado"
              value={`${formatNumber(cO2Summary)} kg CO2e`}
            />

            <SummaryRow
              label="Petróleo economizado"
              value={`${formatNumber(oilSummary)} L`}
            />

            <SummaryRow
              label="Árvores poupadas"
              value={`${formatNumber(treeSummary)} unid.`}
            />

            <SummaryRow
              label="Espaço poupado em aterro"
              value={`${formatNumber(landFillSpaceSummary)} m³`}
            />

            <SummaryRow
              label="Valor climático estimado"
              value={formatCurrency(cO2SummaryValue)}
            />

            <SummaryRow
              label="Benefício socioambiental"
              value={formatCurrency(recoveredValueSummary)}
            />

            <SummaryRow label="Meses analisados" value={`${monthsCount}`} />
          </View>
        </View>

        <View style={styles.tableSection}>
          <SectionTitle
            eyebrow="Linha do tempo"
            title="Evolução mensal dos indicadores"
            description="Resumo mensal dos principais indicadores ambientais calculados a partir das coletas registradas."
          />

          <MonthlyTable
            weightByMonth={weightByMonth}
            waterByMonth={waterByMonth}
            energyByMonth={energyByMonth}
            oilBymonth={oilBymonth}
            treeByMonth={treeByMonth}
          />
        </View>

        <View style={styles.noteBox}>
          <Text style={styles.noteText}>
            Os percentuais de distribuição representam a composição dos resíduos
            no período filtrado. Filtro aplicado: {context} · Tipo de resíduo:{" "}
            {wasteName || "Todos os resíduos"}.
          </Text>
        </View>
      </View>

      <ReportFooter pageLabel="Página 3 · Distribuição e evolução" />
    </Page>
  );
}
