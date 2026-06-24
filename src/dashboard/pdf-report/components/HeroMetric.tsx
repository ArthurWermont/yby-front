import { StyleSheet, Text, View } from "@react-pdf/renderer";
import { colors } from "../tokens";

type HeroMetricProps = {
  label: string;
  value: string;
  unit?: string;
  caption?: string;
  onDark?: boolean;
};

const styles = StyleSheet.create({
  label: {
    fontSize: 9,
    fontWeight: 700,
    letterSpacing: 1.4,
    textTransform: "uppercase",
    marginBottom: 10,
  },
  valueRow: {
    flexDirection: "row",
    alignItems: "baseline",
  },
  value: {
    fontFamily: "Spectral",
    fontSize: 64,
    fontWeight: 700,
    color: "strong",
    lineHeight: 0.95,
  },
  unit: {
    fontSize: 13,
    fontWeight: 600,
    marginLeft: 12,
    marginBottom: 8,
  },
  caption: {
    fontSize: 11,
    lineHeight: 1.45,
    marginTop: 12,
    maxWidth: 310,
  },
});

export function HeroMetric({
  label,
  value,
  unit,
  caption,
  onDark = false,
}: HeroMetricProps) {
  return (
    <View>
      <Text
        style={[
          styles.label,
          { color: onDark ? colors.beige200 : colors.forest700 },
        ]}
      >
        {label}
      </Text>

      <View style={styles.valueRow}>
        <Text
          style={[
            styles.value,
            { color: onDark ? colors.beige50 : colors.brown900 },
          ]}
        >
          {value}
        </Text>

        {unit ? (
          <Text
            style={[
              styles.unit,
              { color: onDark ? colors.beige200 : colors.brown500 },
            ]}
          >
            {unit}
          </Text>
        ) : null}
      </View>

      {caption ? (
        <Text
          style={[
            styles.caption,
            { color: onDark ? colors.beige100 : colors.brown700 },
          ]}
        >
          {caption}
        </Text>
      ) : null}
    </View>
  );
}

// 40.341,31 kg
// resíduos coletados no período
