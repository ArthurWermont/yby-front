import { Image, StyleSheet, Text, View } from "@react-pdf/renderer";
import { colors, spacing } from "../tokens";

type ReportHeaderProps = {
  title: string;
  period: string;
  context?: string;
};

const styles = StyleSheet.create({
  header: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "flex-end",
    borderBottomWidth: 2,
    borderBottomColor: colors.forest700,
    paddingBottom: spacing.md,
    marginBottom: spacing.xl,
  },
  brand: {
    flexDirection: "row",
    alignItems: "center",
  },
  logo: {
    width: 34,
    height: 34,
    marginRight: 10,
  },
  brandName: {
    fontSize: 15,
    fontWeight: 700,
    color: colors.forest900,
    letterSpacing: 0.5,
  },
  brandSubtitle: {
    fontSize: 7,
    color: colors.brown500,
    letterSpacing: 1.3,
    textTransform: "uppercase",
    marginTop: 3,
  },
  info: {
    textAlign: "right",
  },
  title: {
    fontSize: 16,
    fontWeight: 700,
    color: colors.brown900,
    marginBottom: 4,
  },
  period: {
    fontSize: 8,
    color: colors.brown500,
    marginBottom: 2,
  },
  context: {
    fontSize: 8,
    color: colors.forest700,
    fontWeight: 600,
  },
});

export function ReportHeader({ title, period, context }: ReportHeaderProps) {
  return (
    <View style={styles.header}>
      <View style={styles.brand}>
        <Image src="/ybyicon.png" style={styles.logo} />

        <View>
          <Text style={styles.brandName}>YBY</Text>
          <Text style={styles.brandSubtitle}>Soluções Sustentáveis</Text>
        </View>
      </View>

      <View style={styles.info}>
        <Text style={styles.title}>{title}</Text>
        <Text style={styles.period}>{period}</Text>
        {context ? <Text style={styles.context}>{context}</Text> : null}
      </View>
    </View>
  );
}

// Página 2 — Indicadores ambientais
// Página 3 — Distribuição e evolução