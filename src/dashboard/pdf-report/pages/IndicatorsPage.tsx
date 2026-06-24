import { Page, StyleSheet, Text, View } from "@react-pdf/renderer";

import type {
  EnergyDataType,
  IByWaste,
  OilDataType,
  TreeDataType,
  WaterDataType,
  WeightDataType,
} from "../../../api/dashboard";

import { MetricCard } from "../components/MetricCard";
import { ReportFooter } from "../components/ReportFooter";
import { ReportHeader } from "../components/ReportHeader";
import { SectionTitle } from "../components/SectionTitle";
import { colors, spacing } from "../tokens";
import {
  formatCurrency,
  formatNumber,
  formatPeriod,
  getContextLabel,
  getReportTitle,
} from "../utils";

import type { DashboardReportPdfProps } from "../types";

type IndicatorsPageProps = DashboardReportPdfProps;

const styles = StyleSheet.create({
  page: {
    backgroundColor: colors.beige50,
    paddingTop: 30,
    paddingRight: 42,
    paddingBottom: 50,
    paddingLeft: 42,
    fontFamily: "Helvetica",
  },

  content: {
    flexGrow: 1,
  },

  featureGrid: {
    flexDirection: "row",
    flexWrap: "wrap",
    justifyContent: "space-between",
    marginBottom: 14,
  },

  featureCard: {
    width: "48.7%",
    marginBottom: 10,
  },

  secondaryGrid: {
    flexDirection: "row",
    flexWrap: "wrap",
    justifyContent: "space-between",
    marginBottom: 8,
  },

  secondaryCard: {
    width: "32%",
    marginBottom: 9,
  },

  noteBox: {
    backgroundColor: colors.beige100,
    borderWidth: 1,
    borderColor: colors.border,
    borderRadius: 12,
    padding: 11,
    marginTop: 2,
  },

  noteEyebrow: {
    fontSize: 8,
    color: colors.forest700,
    fontWeight: 700,
    letterSpacing: 1.2,
    textTransform: "uppercase",
    marginBottom: 6,
  },

  noteText: {
    fontSize: 9,
    color: colors.brown700,
    lineHeight: 1.45,
  },

  filterText: {
    fontSize: 8,
    color: colors.brown500,
    marginTop: 4,
    lineHeight: 1.35,
  },
});

export function IndicatorsPage({
  mode,
  startDate,
  endDate,
  selectedPevNames = [],
  wasteName,

  weightByMonth = [],
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
}: IndicatorsPageProps) {
  const period = formatPeriod(startDate, endDate);

  const context = getContextLabel({
    mode,
    selectedPevNames,
  });

  const reportTitle = getReportTitle(mode);

  const monthsCount = weightByMonth.length;

  return (
    <Page size="A4" style={styles.page}>
      <View style={styles.content}>
        <ReportHeader title={reportTitle} period={period} context={context} />

        <SectionTitle
          eyebrow="Resultados em destaque"
          title="Os quatro indicadores de impacto"
          description="Indicadores ambientais consolidados com base nas coletas registradas no período selecionado."
        />

        <View style={styles.featureGrid}>
          <View style={styles.featureCard}>
            <MetricCard
              featured
              label="Peso coletado"
              value={formatNumber(weightSummary)}
              unit="kg"
              accent={colors.forest700}
              caption="Total de resíduos recuperados e desviados do aterro."
            />
          </View>

          <View style={styles.featureCard}>
            <MetricCard
              featured
              label="Água economizada"
              value={formatNumber(waterSummary)}
              unit="litros"
              accent={colors.water}
              caption="Recurso hídrico preservado por meio da reciclagem."
            />
          </View>

          <View style={styles.featureCard}>
            <MetricCard
              featured
              label="CO2e evitado"
              value={formatNumber(cO2Summary)}
              unit="kg CO2e"
              accent={colors.forest500}
              caption="Emissões de gases de efeito estufa evitadas."
            />
          </View>

          <View style={styles.featureCard}>
            <MetricCard
              featured
              label="Árvores poupadas"
              value={formatNumber(treeSummary)}
              unit="unidades equiv."
              accent={colors.gold}
              caption="Equivalência em árvores preservadas no período."
            />
          </View>
        </View>

        <SectionTitle
          eyebrow="Equivalências e valor"
          title="Indicadores complementares"
          description="Dados adicionais que ampliam a leitura ambiental, climática e socioeconômica dos resultados."
        />

        <View style={styles.secondaryGrid}>
          <View style={styles.secondaryCard}>
            <MetricCard
              label="Energia economizada"
              value={formatNumber(energySummary)}
              unit="MWh"
              caption="Energia preservada pela reciclagem."
            />
          </View>

          <View style={styles.secondaryCard}>
            <MetricCard
              label="Petróleo economizado"
              value={formatNumber(oilSummary)}
              unit="litros"
              caption="Recurso fóssil economizado no período."
            />
          </View>

          <View style={styles.secondaryCard}>
            <MetricCard
              label="Valor climático estimado"
              value={formatCurrency(cO2SummaryValue)}
              caption="Estimativa associada ao CO2e evitado."
            />
          </View>

          <View style={styles.secondaryCard}>
            <MetricCard
              label="Benefício socioambiental"
              value={formatCurrency(recoveredValueSummary)}
              caption="Valor socioambiental estimado."
            />
          </View>

          <View style={styles.secondaryCard}>
            <MetricCard
              label="Espaço em aterro"
              value={formatNumber(landFillSpaceSummary)}
              unit="m³"
              caption="Espaço poupado em aterro sanitário."
            />
          </View>

          <View style={styles.secondaryCard}>
            <MetricCard
              label="Tipos de resíduos"
              value={`${dataResiduos.length}`}
              unit="tipos"
              caption="Categorias identificadas no período."
            />
          </View>
        </View>

        <View style={styles.noteBox}>
          <Text style={styles.noteEyebrow}>Leitura do período</Text>

          <Text style={styles.noteText}>
            Resultados consolidados ao longo de {monthsCount || 0} mês(es) de
            coletas registradas na plataforma YBY.
          </Text>

          <Text style={styles.filterText}>
            Filtro aplicado: {context} · Tipo de resíduo:{" "}
            {wasteName || "Todos os resíduos"}.
          </Text>
        </View>
      </View>

      <ReportFooter pageLabel="Página 2 · Indicadores ambientais" />
    </Page>
  );
}
