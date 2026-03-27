import {
  Document,
  Image,
  Page,
  StyleSheet,
  Text,
  View,
} from "@react-pdf/renderer";
import { format } from "date-fns";
import type {
  EnergyDataType,
  IByWaste,
  OilDataType,
  TreeDataType,
  WaterDataType,
  WeightDataType,
} from "../api/dashboard";

interface DashboardPDFProps {
  mode: "admin" | "client";
  startDate: string;
  endDate: string;
  pevId?: string;
  pevName?: string;
  waste?: string;
  wasteName?: string;

  weightByMonth?: WeightDataType[];
  waterByMonth?: WaterDataType[];
  energyByMonth?: EnergyDataType[];
  oilBymonth?: OilDataType[];
  treeByMonth?: TreeDataType[];

  weightSummary?: number;
  waterSummary?: number;
  cO2Summary?: number;
  cO2SummaryValue?: number;
  recoveredValueSummary?: number;
  energySummary?: number;
  oilSummary?: number;
  treeSummary?: number;
  dataResiduos?: IByWaste[];
}

const styles = StyleSheet.create({
  page: {
    backgroundColor: "#fff",
    padding: 30,
  },
  header: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 20,
    borderBottom: 1,
    borderBottomColor: "#4B3838",
    paddingBottom: 10,
  },
  title: {
    fontSize: 24,
    color: "#4B3838",
    fontWeight: "bold",
  },
  subtitle: {
    fontSize: 12,
    color: "#666",
    marginTop: 4,
  },
  logo: {
    width: 55,
    height: 55,
  },
  section: {
    marginBottom: 20,
  },
  filters: {
    backgroundColor: "#FAF1E8",
    padding: 10,
    borderRadius: 5,
    marginBottom: 20,
  },
  filterText: {
    fontSize: 10,
    color: "#4B3838",
    marginBottom: 5,
  },
  table: {
    width: "100%",
    marginTop: 10,
    borderStyle: "solid",
    borderWidth: 1,
    borderColor: "#000",
  },
  tableRow: {
    flexDirection: "row",
    borderBottomWidth: 1,
    borderBottomColor: "#000",
    minHeight: 30,
    alignItems: "center",
  },
  tableHeader: {
    backgroundColor: "#EBD6C7",
    fontWeight: "bold",
  },
  zebraRow: {
    backgroundColor: "#FCF7F2",
  },
  tableCell: {
    flex: 1,
    padding: 8,
    fontSize: 10,
    textAlign: "center",
  },
  summaryBox: {
    backgroundColor: "#FAF1E8",
    padding: 10,
    borderRadius: 5,
    marginTop: 20,
  },
  summaryTitle: {
    fontSize: 12,
    fontWeight: "bold",
    color: "#4B3838",
    marginBottom: 5,
  },
  summaryText: {
    fontSize: 10,
    color: "#4B3838",
  },
  footer: {
    position: "absolute",
    bottom: 30,
    left: 30,
    right: 30,
    fontSize: 8,
    textAlign: "center",
    color: "#666",
  },
  cardGroup: {
    marginBottom: 18,
  },

  cardGroupTitle: {
    fontSize: 11,
    fontWeight: "bold",
    color: "#6D5C5C",
    marginBottom: 8,
    textTransform: "uppercase",
  },

  cardRow: {
    flexDirection: "row",
    flexWrap: "wrap",
    justifyContent: "space-between",
    rowGap: 10,
    columnGap: 10,
  },

  currentMonthCard: {
    backgroundColor: "#F8F3ED",
    borderRadius: 10,
    paddingTop: 10,
    paddingRight: 12,
    paddingBottom: 12,
    paddingLeft: 12,
    width: "23.5%",
    borderWidth: 1,
    borderColor: "#E7DDD2",
  },

  currentMonthCardWeight: {
    backgroundColor: "#F8F3ED",
    borderRadius: 10,
    paddingTop: 10,
    paddingRight: 12,
    paddingBottom: 12,
    paddingLeft: 12,
    width: "23.5%",
    borderWidth: 1,
    borderColor: "#E7DDD2",
    borderTopWidth: 5,
    borderTopColor: "#4B3838",
  },

  cardLabel: {
    fontSize: 9,
    color: "#7B6F6F",
    marginBottom: 6,
    fontWeight: "medium",
  },

  cardSubtitle: {
    fontSize: 10,
    color: "#8C7A7A",
    fontWeight: "400",
    marginBottom: 2,
  },

  cardTitleEnergy: {
    fontSize: 11,
    fontWeight: "bold",
    color: "#4B3838",
    marginBottom: 6,
  },
  cardTitleWater: {
    fontSize: 11,
    fontWeight: "bold",
    color: "#4B3838",
    marginBottom: 6,
  },
  cardTitleCO2: {
    fontSize: 11,
    fontWeight: "bold",
    color: "#4B3838",
    marginBottom: 6,
  },
  cardTitleCO2Value: {
    fontSize: 11,
    fontWeight: "bold",
    color: "#4B3838",
    marginBottom: 6,
  },
  cardTitleRecoveredValue: {
    fontSize: 11,
    fontWeight: "bold",
    color: "#4B3838",
    marginBottom: 6,
  },
  cardTitleOil: {
    fontSize: 11,
    fontWeight: "bold",
    color: "#4B3838",
    marginBottom: 6,
  },
  cardTitleTree: {
    fontSize: 11,
    fontWeight: "bold",
    color: "#4B3838",
    marginBottom: 6,
  },
  cardTitleWeight: {
    fontSize: 11,
    fontWeight: "bold",
    color: "#4B3838",
    marginBottom: 6,
  },
  cardValue: {
    fontSize: 15,
    fontWeight: "bold",
    color: "#2F2927",
    lineHeight: 1.2,
  },
  cardUnit: {
    fontSize: 9,
    color: "#8A7D7D",
    marginTop: 2,
  },
  wastesDistribution: {
    marginTop: 15,
    padding: 10,
    backgroundColor: "#FAF1E8",
    borderRadius: 5,
  },
  wasteItem: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginBottom: 5,
    padding: 5,
  },
  colorBox: {
    width: 12,
    height: 12,
    marginRight: 5,
  },
  totalsRow: {
    flexDirection: "row",
    justifyContent: "space-between",
  },
  totalsCol: {
    width: "48%",
  },
});

const formatNumber = (value: number | undefined) => {
  return (value ?? 0).toLocaleString("pt-BR", {
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  });
};

const COLORS = [
  "#4B3838",
  "#1FA64C",
  "#8E44AD",
  "#F1592A",
  "#F1C40F",
  "#3498DB",
  "#7F8C8D",
];

const DashboardPDF = ({
  mode,
  startDate,
  endDate,
  pevId,
  pevName,
  waste,
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
  cO2Summary,
  cO2SummaryValue,
  recoveredValueSummary,
  dataResiduos = [],
}: DashboardPDFProps) => {
  const periodLabel = `${format(
    new Date(`${startDate}T00:00:00`),
    "dd/MM/yyyy",
  )} até ${format(new Date(`${endDate}T23:59:59.999Z`), "dd/MM/yyyy")}`;

  // const totalWeight = dataLinhaState.reduce((sum, item) => sum + item.peso, 0);
  // const totalEnergy = energiaData.reduce((sum, item) => sum + item.mwh, 0);
  // const totalWater = aguaData.reduce((sum, item) => sum + item.litros, 0);
  // const totalOil = oilData.reduce((sum, item) => sum + item.litros, 0);
  // const totalTree = treeData?.reduce((sum, item) => sum + item.value, 0);

  const isAdmin = mode === "admin";
  const isClient = mode === "client";
  // const hasSelectedPev = !!selectedPev;

  // const showYbyThisMonth =
  //   isAdmin && !hasSelectedPev && periodLabel === "Últimos 6 meses";

  return (
    <Document>
      <Page size="A4" orientation="landscape" style={styles.page}>
        <View style={styles.header}>
          <View>
            <Text style={styles.title}>
              {isAdmin ? "Relatório Geral" : "Relatório do Cliente"}
            </Text>
            <Text style={styles.subtitle}>Período: {periodLabel}</Text>
          </View>

          <Image src="/ybyBlack.png" style={styles.logo} />
        </View>
        {/* Filtros */}
        <View style={styles.filters}>
          {isAdmin && (
            <Text style={styles.filterText}>PEV: {pevName || "Todos"}</Text>
          )}

          <Text style={styles.filterText}>
            Tipo de Resíduo: {wasteName || "Todos"}
          </Text>

          {isClient && (
            <Text style={styles.filterText}>Cliente: {pevName}</Text>
          )}
        </View>
        <View style={styles.cardGroup}>
          <Text style={styles.cardGroupTitle}>Indicadores ambientais</Text>

          <View style={styles.cardRow}>
            <View style={styles.currentMonthCardWeight}>
              <Text style={styles.cardTitleWeight}>Peso Coletado</Text>
              <Text style={styles.cardValue}>
                {formatNumber(weightSummary)}
              </Text>
              <Text style={styles.cardUnit}>kg</Text>
            </View>

            <View style={styles.currentMonthCard}>
              <Text style={styles.cardTitleEnergy}>Energia Economizada</Text>
              <Text style={styles.cardValue}>
                {formatNumber(energySummary)}
              </Text>
              <Text style={styles.cardUnit}>MWh</Text>
            </View>

            <View style={styles.currentMonthCard}>
              <Text style={styles.cardTitleWater}>Água Economizada</Text>
              <Text style={styles.cardValue}>{formatNumber(waterSummary)}</Text>
              <Text style={styles.cardUnit}>Litros</Text>
            </View>

            <View style={styles.currentMonthCard}>
              <Text style={styles.cardTitleCO2}>CO2e Evitado</Text>
              <Text style={styles.cardValue}>{formatNumber(cO2Summary)}</Text>
              <Text style={styles.cardUnit}>kg CO2e</Text>
            </View>
          </View>
        </View>

        <View style={styles.cardGroup}>
          <Text style={styles.cardGroupTitle}>
            Indicadores de valor e equivalência
          </Text>

          <View style={styles.cardRow}>
            <View style={styles.currentMonthCard}>
              <Text style={styles.cardTitleCO2Value}>
                Valor Climático Estimado
              </Text>
              <Text style={styles.cardValue}>
                R$ {formatNumber(cO2SummaryValue)}
              </Text>
              <Text style={styles.cardUnit}>baseado no CO2e evitado</Text>
            </View>

            <View style={styles.currentMonthCard}>
              <Text style={styles.cardTitleRecoveredValue}>
                Benefício Socioambiental
              </Text>
              <Text style={styles.cardValue}>
                R$ {formatNumber(recoveredValueSummary)}
              </Text>
              <Text style={styles.cardUnit}>valor estimado recuperado</Text>
            </View>

            <View style={styles.currentMonthCard}>
              <Text style={styles.cardTitleOil}>Petróleo Economizado</Text>
              <Text style={styles.cardValue}>{formatNumber(oilSummary)}</Text>
              <Text style={styles.cardUnit}>Litros</Text>
            </View>

            <View style={styles.currentMonthCard}>
              <Text style={styles.cardTitleTree}>Árvores Poupadas</Text>
              <Text style={styles.cardValue}>{formatNumber(treeSummary)}</Text>
              <Text style={styles.cardUnit}>unidades equivalentes</Text>
            </View>
          </View>
        </View>

        {/* Tabela de dados mensais */}
        <View style={styles.section}>
          <Text style={styles.summaryTitle}>Resumo das Coletas</Text>
          <View style={styles.table}>
            <View style={[styles.tableRow, styles.tableHeader]}>
              <Text style={styles.tableCell}>Mês</Text>
              <Text style={styles.tableCell}>Peso (kg)</Text>
              <Text style={styles.tableCell}>Energia Economizada (MWh)</Text>
              <Text style={styles.tableCell}>Água (L)</Text>
              <Text style={styles.tableCell}>Petróleo Economizado (L)</Text>
              <Text style={styles.tableCell}>Árvores Poupadas</Text>
            </View>

            {weightByMonth.map((item: WeightDataType, index: number) => (
              <View
                key={index}
                style={[
                  styles.tableRow,
                  index % 2 === 1 ? styles.zebraRow : {},
                ]}
              >
                <Text style={styles.tableCell}>{item.month}</Text>
                <Text style={styles.tableCell}>
                  {formatNumber(item.totalWeight)}
                </Text>
                <Text style={styles.tableCell}>
                  {formatNumber(energyByMonth![index]?.mwh || 0)}
                </Text>
                <Text style={styles.tableCell}>
                  {formatNumber(waterByMonth![index]?.totalLitros || 0)}
                </Text>
                <Text style={styles.tableCell}>
                  {formatNumber(oilBymonth![index]?.litros || 0)}
                </Text>
                <Text style={styles.tableCell}>
                  {formatNumber(treeByMonth!?.[index]?.value ?? 0)}
                </Text>
              </View>
            ))}
          </View>
        </View>

        {/* Distribuição de Resíduos */}
        <View style={styles.wastesDistribution}>
          <Text style={styles.summaryTitle}>Distribuição de Resíduos</Text>

          {dataResiduos.map((item: IByWaste, index: number) => (
            <View key={index} style={styles.wasteItem}>
              <View style={{ flexDirection: "row", alignItems: "center" }}>
                <View
                  style={[
                    styles.colorBox,
                    { backgroundColor: COLORS[index % COLORS.length] },
                  ]}
                />
                <Text style={styles.summaryText}>{item.name}</Text>
              </View>
              <Text style={styles.summaryText}>
                {formatNumber(item.value)}%
              </Text>
            </View>
          ))}
        </View>

        <View style={styles.summaryBox}>
          {/* Totais */}
          <View style={styles.totalsRow}>
            <View style={styles.totalsCol}>
              <Text style={styles.summaryTitle}>Totais do Período</Text>
              <Text style={styles.summaryText}>
                Total de Peso Coletado: {formatNumber(weightSummary)} kg
              </Text>
              <Text style={styles.summaryText}>
                Total de Energia Economizada: {formatNumber(energySummary)} MWh
              </Text>
              <Text style={styles.summaryText}>
                Total de Água Economizada: {formatNumber(waterSummary)} Litros
              </Text>
              <Text style={styles.summaryText}>
                CO2 Evitado: {formatNumber(cO2Summary)} kg CO2e
              </Text>
            </View>
          </View>
        </View>

        <View style={styles.summaryBox}>
          {/* Totais */}
          <View style={styles.totalsRow}>
            <View style={styles.totalsCol}>
              <Text style={styles.summaryText}>
                Valor Climático Estimado: {formatNumber(cO2SummaryValue)} R$
              </Text>
              <Text style={styles.summaryText}>
                Benefício Socioambiental: {formatNumber(recoveredValueSummary)}{" "}
                R$
              </Text>
              <Text style={styles.summaryText}>
                Total de Petróleo Economizado: {formatNumber(oilSummary)} Litros
              </Text>
              <Text style={styles.summaryText}>
                Total de Árvores Poupadas: {formatNumber(treeSummary) ?? 0}{" "}
              </Text>

              <Text style={styles.summaryText}>
                Total de Meses: {weightByMonth.length}
              </Text>

              <Text style={styles.summaryText}>
                Tipos de Resíduos esse mês: {dataResiduos.length}
              </Text>
            </View>
          </View>
        </View>

        <Text style={styles.footer}>
          Relatório gerado em {format(new Date(), "dd/MM/yyyy HH:mm")} | YBY
          Reciclagem
        </Text>
      </Page>
    </Document>
  );
};

export default DashboardPDF;
