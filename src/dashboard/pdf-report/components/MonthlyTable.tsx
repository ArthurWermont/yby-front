import { StyleSheet, Text, View } from "@react-pdf/renderer";

import type {
  EnergyDataType,
  OilDataType,
  TreeDataType,
  WaterDataType,
  WeightDataType,
} from "../../../api/dashboard";

import { colors } from "../tokens";
import { formatNumber } from "../utils";

type MonthlyTableProps = {
  weightByMonth: WeightDataType[];
  waterByMonth: WaterDataType[];
  energyByMonth: EnergyDataType[];
  oilBymonth: OilDataType[];
  treeByMonth: TreeDataType[];
};

const styles = StyleSheet.create({
  table: {
    width: "100%",
    borderTopWidth: 1,
    borderTopColor: colors.borderDark,
    marginTop: 8,
  },

  row: {
    flexDirection: "row",
    minHeight: 22,
    borderBottomWidth: 1,
    borderBottomColor: colors.border,
    alignItems: "center",
  },

  headerRow: {
    minHeight: 25,
    backgroundColor: colors.beige100,
  },

  zebraRow: {
    backgroundColor: colors.beige50,
  },

  cellMonth: {
    width: "14%",
    paddingHorizontal: 6,
    fontSize: 7.5,
    color: colors.brown700,
  },

  cell: {
    width: "17.2%",
    paddingHorizontal: 5,
    fontSize: 7.2,
    color: colors.brown700,
    textAlign: "right",
  },

  headerCellMonth: {
    width: "14%",
    paddingHorizontal: 6,
    fontSize: 7,
    color: colors.forest700,
    fontWeight: 700,
    textTransform: "uppercase",
    letterSpacing: 0.5,
  },

  headerCell: {
    width: "17.2%",
    paddingHorizontal: 5,
    fontSize: 7,
    color: colors.forest700,
    fontWeight: 700,
    textAlign: "right",
    textTransform: "uppercase",
    letterSpacing: 0.4,
  },

  emptyBox: {
    backgroundColor: colors.beige100,
    borderWidth: 1,
    borderColor: colors.border,
    borderRadius: 10,
    padding: 12,
    marginTop: 8,
  },

  emptyText: {
    fontSize: 8.5,
    color: colors.brown500,
    lineHeight: 1.4,
  },
});

export function MonthlyTable({
  weightByMonth = [],
  waterByMonth = [],
  energyByMonth = [],
  oilBymonth = [],
  treeByMonth = [],
}: MonthlyTableProps) {
  if (weightByMonth.length === 0) {
    return (
      <View style={styles.emptyBox}>
        <Text style={styles.emptyText}>
          Nenhum dado mensal foi encontrado para o período selecionado.
        </Text>
      </View>
    );
  }

  return (
    <View style={styles.table}>
      <View style={[styles.row, styles.headerRow]}>
        <Text style={styles.headerCellMonth}>Mês</Text>
        <Text style={styles.headerCell}>Peso kg</Text>
        <Text style={styles.headerCell}>Água L</Text>
        <Text style={styles.headerCell}>Energia MWh</Text>
        <Text style={styles.headerCell}>Petróleo L</Text>
        <Text style={styles.headerCell}>Árvores</Text>
      </View>

      {weightByMonth.map((item, index) => {
        const rowStyle =
          index % 2 === 1 ? [styles.row, styles.zebraRow] : [styles.row];

        return (
          <View key={`${item.month}-${index}`} style={rowStyle}>
            <Text style={styles.cellMonth}>{item.month}</Text>

            <Text style={styles.cell}>{formatNumber(item.totalWeight)}</Text>

            <Text style={styles.cell}>
              {formatNumber(waterByMonth[index]?.totalLitros ?? 0)}
            </Text>

            <Text style={styles.cell}>
              {formatNumber(energyByMonth[index]?.mwh ?? 0)}
            </Text>

            <Text style={styles.cell}>
              {formatNumber(oilBymonth[index]?.litros ?? 0)}
            </Text>

            <Text style={styles.cell}>
              {formatNumber(treeByMonth[index]?.value ?? 0)}
            </Text>
          </View>
        );
      })}
    </View>
  );
}
