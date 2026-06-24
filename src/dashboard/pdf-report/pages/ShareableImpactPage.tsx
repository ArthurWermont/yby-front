import { Image, Page, StyleSheet, Text, View } from "@react-pdf/renderer";

import { colors, spacing } from "../tokens";
import type { DashboardReportPdfProps } from "../types";
import {
  formatCompactNumber,
  formatInteger,
  formatPeriod,
  getContextLabel,
} from "../utils";

const styles = StyleSheet.create({
  page: {
    backgroundColor: colors.forest900,
    paddingTop: 0,
    paddingRight: spacing.page,
    paddingBottom: 42,
    paddingLeft: spacing.page,
    fontFamily: "Helvetica",
    color: colors.beige50,
  },

  topBand: {
    position: "absolute",
    top: 0,
    left: 0,
    right: 0,
    height: 24,
    backgroundColor: "#6D5C5C",
    alignItems: "center",
    justifyContent: "center",
  },

  topBandText: {
    fontSize: 7,
    fontWeight: 700,
    color: colors.beige100,
    letterSpacing: 1.4,
    textTransform: "uppercase",
  },

  content: {
    flexGrow: 1,
    alignItems: "center",
    paddingTop: 76,
  },

  logo: {
    width: 38,
    height: 38,
    marginBottom: 12,
    opacity: 0.82,
  },

  brandName: {
    fontSize: 21,
    fontWeight: 700,
    color: colors.beige50,
    letterSpacing: 1,
    textAlign: "center",
  },

  brandSubtitle: {
    fontSize: 7,
    color: colors.beige200,
    letterSpacing: 1.7,
    textTransform: "uppercase",
    marginTop: 5,
    textAlign: "center",
  },

  phrase: {
    fontFamily: "Spectral",
    fontSize: 24,
    fontWeight: 700,
    fontStyle: "italic",
    textAlign: "center",
    lineHeight: 1.22,
    width: 430,
    marginTop: 58,
    marginBottom: 34,
    color: colors.beige50,
  },

  watermark: {
    position: "absolute",
    width: 265,
    height: 265,
    left: 165,
    top: 300,
    opacity: 0.055,
  },

  metricArea: {
    width: "100%",
    borderTopWidth: 1,
    borderTopColor: "#355F43",
    borderBottomWidth: 1,
    borderBottomColor: "#355F43",
    paddingTop: 26,
    paddingBottom: 26,
    marginBottom: 26,
  },

  metricRow: {
    flexDirection: "row",
    justifyContent: "space-between",
  },

  metricBox: {
    width: "31%",
    alignItems: "center",
  },

  metricValue: {
    fontFamily: "Spectral",
    fontSize: 40,
    fontWeight: 700,
    color: colors.beige50,
    textAlign: "center",
    lineHeight: 1,
  },

  metricUnit: {
    fontSize: 7.5,
    color: colors.beige200,
    marginTop: 7,
    textAlign: "center",
  },

  metricLabel: {
    fontSize: 7.5,
    color: colors.beige100,
    fontWeight: 700,
    letterSpacing: 1.1,
    textTransform: "uppercase",
    marginTop: 6,
    textAlign: "center",
  },

  co2Text: {
    fontSize: 10.5,
    color: colors.beige100,
    fontWeight: 600,
    textAlign: "center",
    lineHeight: 1.45,
    width: 440,
  },

  footer: {
    position: "absolute",
    left: spacing.page,
    right: spacing.page,
    bottom: 32,
    flexDirection: "row",
    justifyContent: "space-between",
    borderTopWidth: 1,
    borderTopColor: "#355F43",
    paddingTop: 12,
  },

  footerText: {
    fontSize: 7.5,
    color: colors.beige200,
  },
});

export function ShareableImpactPage({
  mode,
  startDate,
  endDate,
  selectedPevNames = [],
  wasteName,
  weightSummary,
  waterSummary,
  cO2Summary,
  treeSummary,
}: DashboardReportPdfProps) {
  const period = formatPeriod(startDate, endDate);

  const context = getContextLabel({
    mode,
    selectedPevNames,
  });

  return (
    <Page size="A4" style={styles.page}>
      {/* <View style={styles.topBand}>
        <Text style={styles.topBandText}>Card de impacto compartilhável</Text>
      </View> */}

      <Image src="/ybyiconcream.png" style={styles.watermark} />

      <View style={styles.content}>
        <Image src="/ybyiconcream.png" style={styles.logo} />

        <Text style={styles.brandName}>YBY</Text>
        <Text style={styles.brandSubtitle}>Soluções Sustentáveis</Text>

        <Text style={styles.phrase}>
          Juntos, transformamos coletas em impacto ambiental real.
        </Text>

        <View style={styles.metricArea}>
          <View style={styles.metricRow}>
            <View style={styles.metricBox}>
              <Text style={styles.metricValue}>
                {formatInteger(weightSummary)}
              </Text>
              <Text style={styles.metricUnit}>kg de resíduos</Text>
              <Text style={styles.metricLabel}>Peso coletado</Text>
            </View>

            <View style={styles.metricBox}>
              <Text style={styles.metricValue}>
                {formatCompactNumber(waterSummary)}
              </Text>
              <Text style={styles.metricUnit}>litros de água</Text>
              <Text style={styles.metricLabel}>Economizada</Text>
            </View>

            <View style={styles.metricBox}>
              <Text style={styles.metricValue}>
                {formatInteger(treeSummary)}
              </Text>
              <Text style={styles.metricUnit}>árvores equiv.</Text>
              <Text style={styles.metricLabel}>Poupadas</Text>
            </View>
          </View>
        </View>

        <Text style={styles.co2Text}>
          E {formatInteger(cO2Summary)} kg de CO2e evitados no período — o
          equivalente a reduzir emissões por meio da reciclagem.
        </Text>
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
