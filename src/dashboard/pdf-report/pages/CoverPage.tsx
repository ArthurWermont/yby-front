import { Image, Page, StyleSheet, Text, View } from "@react-pdf/renderer";

import type {
  EnergyDataType,
  IByWaste,
  OilDataType,
  TreeDataType,
  WaterDataType,
  WeightDataType,
} from "../../../api/dashboard";

import { HeroMetric } from "../components/HeroMetric";
import { colors, spacing } from "../tokens";
import {
  formatCompactNumber,
  formatNumber,
  formatPeriod,
  getContextLabel,
} from "../utils";

import type { DashboardReportPdfProps } from "../types";

type CoverPageProps = DashboardReportPdfProps;

const styles = StyleSheet.create({
  page: {
    backgroundColor: colors.forest900,
    paddingTop: 42,
    paddingRight: spacing.page,
    paddingBottom: 42,
    paddingLeft: spacing.page,
    fontFamily: "Hanken Grotesk",
    color: colors.beige50,
  },

  topBar: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "flex-start",
  },

  brand: {
    flexDirection: "row",
    alignItems: "center",
  },

  logo: {
    width: 36,
    height: 36,
    marginRight: 10,
  },

  brandName: {
    fontSize: 17,
    fontWeight: 700,
    color: colors.beige50,
    letterSpacing: 0.8,
  },

  brandSubtitle: {
    fontSize: 7,
    color: colors.beige200,
    letterSpacing: 1.4,
    textTransform: "uppercase",
    marginTop: 3,
  },

  reportLabel: {
    fontSize: 8,
    color: colors.beige200,
    fontWeight: 700,
    letterSpacing: 1.4,
    textTransform: "uppercase",
    textAlign: "right",
  },

  reportSubLabel: {
    fontSize: 8,
    color: colors.beige100,
    marginTop: 5,
    textAlign: "right",
  },

  heroArea: {
    marginTop: 130,
  },

  phrase: {
    fontFamily: "Spectral",
    fontSize: 19,
    color: colors.beige200,
    fontWeight: 700,
    lineHeight: 1.3,
    marginBottom: 26,
    maxWidth: 380,
  },

  chipsRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginTop: 95,
  },

  chip: {
    width: "31%",
    borderWidth: 1,
    borderColor: "#6F9B78",
    borderRadius: 12,
    padding: 14,
    backgroundColor: "#1A3325",
  },

  chipLabel: {
    fontSize: 7,
    color: colors.beige200,
    fontWeight: 700,
    letterSpacing: 1,
    textTransform: "uppercase",
    marginBottom: 8,
  },

  chipValue: {
    fontSize: 18,
    color: colors.beige50,
    fontWeight: 700,
  },

  chipUnit: {
    fontSize: 8,
    color: colors.beige200,
    marginTop: 3,
  },

  footer: {
    position: "absolute",
    left: spacing.page,
    right: spacing.page,
    bottom: 34,
    borderTopWidth: 0.8,
    borderTopColor: "#355F43",
    paddingTop: 12,
    flexDirection: "row",
    justifyContent: "space-between",
  },

  footerText: {
    fontSize: 8,
    color: colors.beige200,
  },

  watermark: {
    position: "absolute",
    right: 25,
    bottom: 70,
    width: 210,
    height: 210,
    opacity: 0.06,
  },
});

export function CoverPage({
  mode,
  startDate,
  endDate,
  selectedPevNames = [],
  wasteName,
  weightSummary,
  waterSummary,
  cO2Summary,
  treeSummary,
}: CoverPageProps) {
  const period = formatPeriod(startDate, endDate);

  const context = getContextLabel({
    mode,
    selectedPevNames,
  });

  return (
    <Page size="A4" style={styles.page}>
      <Image src="/ybyiconcream.png" style={styles.watermark} />

      <View style={styles.topBar}>
        <View style={styles.brand}>
          <Image src="/ybyiconcream.png" style={styles.logo} />

          <View>
            <Text style={styles.brandName}>YBY</Text>
            <Text style={styles.brandSubtitle}>Soluções Sustentáveis</Text>
          </View>
        </View>

        <View>
          <Text style={styles.reportLabel}>Relatório de impacto ambiental</Text>
          <Text style={styles.reportSubLabel}>{period}</Text>
          <Text style={styles.reportSubLabel}>{context}</Text>
        </View>
      </View>

      <View style={styles.heroArea}>
        <Text style={styles.phrase}>
          Cada coleta, um impacto que se multiplica.
        </Text>

        <HeroMetric
          onDark
          label="Resíduos coletados no período"
          value={formatNumber(weightSummary)}
          unit="kg"
          caption="Material recuperado e desviado do aterro sanitário por meio das coletas realizadas com a YBY Soluções Sustentáveis."
        />
      </View>

      <View style={styles.chipsRow}>
        <View style={styles.chip}>
          <Text style={styles.chipLabel}>Água economizada</Text>
          <Text style={styles.chipValue}>
            {formatCompactNumber(waterSummary)}
          </Text>
          <Text style={styles.chipUnit}>litros</Text>
        </View>

        <View style={styles.chip}>
          <Text style={styles.chipLabel}>CO2e evitado</Text>
          <Text style={styles.chipValue}>{formatNumber(cO2Summary)}</Text>
          <Text style={styles.chipUnit}>kg CO2e</Text>
        </View>

        <View style={styles.chip}>
          <Text style={styles.chipLabel}>Árvores poupadas</Text>
          <Text style={styles.chipValue}>{formatNumber(treeSummary)}</Text>
          <Text style={styles.chipUnit}>unidades equivalentes</Text>
        </View>
      </View>

      <View style={styles.footer}>
        <Text style={styles.footerText}>{period}</Text>
        <Text style={styles.footerText}>
          {context} · {wasteName || "Todos os resíduos"}
        </Text>
      </View>
    </Page>
  );
}
