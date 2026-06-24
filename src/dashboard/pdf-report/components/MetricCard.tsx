import { StyleSheet, Text, View } from "@react-pdf/renderer";
import { colors, radius, spacing } from "../tokens";

type MetricCardProps = {
  label: string;
  value: string;
  unit?: string;
  caption?: string;
  accent?: string;
  featured?: boolean;
};

const styles = StyleSheet.create({
  card: {
    backgroundColor: colors.white,
    borderWidth: 1,
    borderColor: colors.border,
    borderRadius: radius.lg,
    padding: spacing.md,
  },
  featuredCard: {
    borderTopWidth: 4,
  },
  label: {
    fontSize: 8.5,
    color: colors.brown500,
    fontWeight: 700,
    marginBottom: 7,
  },
  valueRow: {
    flexDirection: "row",
    alignItems: "baseline",
    flexWrap: "wrap",
  },
  value: {
    fontSize: 19,
    color: colors.brown900,
    fontWeight: 700,
    lineHeight: 1.05,
  },
  featuredValue: {
    fontSize: 27,
  },
  unit: {
    fontSize: 8,
    color: colors.brown500,
    fontWeight: 700,
    marginLeft: 5,
  },
  caption: {
    fontSize: 7.5,
    color: colors.brown400,
    marginTop: 6,
    lineHeight: 1.25,
  },
});

export function MetricCard({
  label,
  value,
  unit,
  caption,
  accent = colors.forest700,
  featured = false,
}: MetricCardProps) {
  const cardStyle = featured
    ? [
        styles.card,
        styles.featuredCard,
        { borderTopColor: accent, minHeight: 105 },
      ]
    : [styles.card, { minHeight: 86 }];

  const valueStyle = featured
    ? [styles.value, styles.featuredValue]
    : [styles.value];

  return (
    <View style={cardStyle}>
      <Text style={styles.label}>{label}</Text>

      <View style={styles.valueRow}>
        <Text style={valueStyle}>{value}</Text>
        {unit ? <Text style={styles.unit}>{unit}</Text> : null}
      </View>

      {caption ? <Text style={styles.caption}>{caption}</Text> : null}
    </View>
  );
}

// Peso coletado
// Água economizada
// CO2e evitado
// Árvores poupadas
