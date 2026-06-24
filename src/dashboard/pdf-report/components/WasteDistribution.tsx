import { StyleSheet, Text, View } from "@react-pdf/renderer";

import type { IByWaste } from "../../../api/dashboard";
import { colors, radius, wasteColors } from "../tokens";
import { formatNumber } from "../utils";

type WasteDistributionProps = {
  data: IByWaste[];
};

const styles = StyleSheet.create({
  wrapper: {
    width: "100%",
  },

  item: {
    marginBottom: 9,
  },

  itemHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 4,
  },

  itemNameWrapper: {
    flexDirection: "row",
    alignItems: "center",
    maxWidth: "72%",
  },

  colorDot: {
    width: 8,
    height: 8,
    borderRadius: 4,
    marginRight: 6,
  },

  itemName: {
    fontSize: 8.5,
    color: colors.brown700,
    fontWeight: 700,
  },

  itemValue: {
    fontSize: 8,
    color: colors.brown500,
    fontWeight: 700,
  },

  barTrack: {
    width: "100%",
    height: 7,
    borderRadius: radius.sm,
    backgroundColor: colors.beige200,
    overflow: "hidden",
  },

  barFill: {
    height: 7,
    borderRadius: radius.sm,
  },

  emptyBox: {
    backgroundColor: colors.beige100,
    borderWidth: 1,
    borderColor: colors.border,
    borderRadius: radius.md,
    padding: 12,
  },

  emptyText: {
    fontSize: 8.5,
    color: colors.brown500,
    lineHeight: 1.4,
  },
});

export function WasteDistribution({ data = [] }: WasteDistributionProps) {
  const orderedData = [...data].sort((a, b) => (b.value ?? 0) - (a.value ?? 0));

  if (orderedData.length === 0) {
    return (
      <View style={styles.emptyBox}>
        <Text style={styles.emptyText}>
          Nenhum dado de distribuição de resíduos foi encontrado para o período
          selecionado.
        </Text>
      </View>
    );
  }

  return (
    <View style={styles.wrapper}>
      {orderedData.map((item, index) => {
        const color = wasteColors[index % wasteColors.length];

        const rawValue = Number(item.value ?? 0);
        const safePercent = Math.max(0, Math.min(rawValue, 100));

        /**
         * Percentuais muito pequenos, como 0,01%, somem visualmente.
         * Por isso usamos um mínimo visual de 2%, mantendo o número real no texto.
         */
        const visualWidth = safePercent > 0 ? Math.max(safePercent, 2) : 0;

        return (
          <View key={`${item.name}-${index}`} style={styles.item}>
            <View style={styles.itemHeader}>
              <View style={styles.itemNameWrapper}>
                <View style={[styles.colorDot, { backgroundColor: color }]} />
                <Text style={styles.itemName}>{item.name}</Text>
              </View>

              <Text style={styles.itemValue}>{formatNumber(rawValue)}%</Text>
            </View>

            <View style={styles.barTrack}>
              <View
                style={[
                  styles.barFill,
                  {
                    width: `${visualWidth}%`,
                    backgroundColor: color,
                  },
                ]}
              />
            </View>
          </View>
        );
      })}
    </View>
  );
}
