import {
  Document,
  Page,
  StyleSheet,
  Text,
  View,
  // Image,
} from "@react-pdf/renderer";
import { format } from "date-fns";

interface DataItem {
  mes: string;
  peso: number;
}

interface EnergyItem {
  mes: string;
  mwh: number;
}

interface WaterItem {
  mes: string;
  litros: number;
}

interface OilItem {
  mes: string;
  litros: number;
}

interface treeItem {
  mes: string;
  value: number;
}

interface WasteItem {
  name: string;
  value: number;
}

interface DashboardPDFProps {
  mode: "admin" | "client";
  dataLinhaState: DataItem[];
  energiaData: EnergyItem[];
  aguaData: WaterItem[];
  oilData: OilItem[];
  treeData?: treeItem[];
  dataResiduos: WasteItem[];
  DataResiduosByPev?: WasteItem[];
  clientName?: string;
  clientDocId?: string;
  selectedPev?: string | null;
  selectedPevName?: string | null;
  selectedTipo?: string | null;
  startDate: string;
  endDate: string;
  currentMonthEnergy: number;
  currentMonthWater: number;
  currentMonthOil: number;
  currentMonthTree: number;
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
  cardRow: {
    flexDirection: "row",
    flexWrap: "wrap",
    justifyContent: "flex-start",
    gap: 12,
    marginBottom: 20,
  },

  currentMonthCard: {
    backgroundColor: "#FAF1E8",
    padding: 12,
    borderRadius: 8,
    width: "23%",
    minWidth: "23%", // evita quebra feia
    maxWidth: "23%", // tudo alinhadinho
  },

  currentMonthCardWeight: {
    backgroundColor: "#FAF1E8",
    padding: 12,
    borderRadius: 8,
    width: "23%",
    borderTopWidth: 4,
    borderTopColor: "#4B3838", // cor institucional YBY
  },

  cardSubtitle: {
    fontSize: 10,
    color: "#8C7A7A",
    fontWeight: "400",
    marginBottom: 2,
  },

  cardTitleEnergy: {
    fontSize: 14,
    fontWeight: "bold",
    color: "#F1592A",
    marginBottom: 5,
  },
  cardTitleWater: {
    fontSize: 14,
    fontWeight: "bold",
    color: "#005C87",
    marginBottom: 5,
  },
  cardTitleOil: {
    fontSize: 14,
    fontWeight: "bold",
    color: "#0D0D0D",
    marginBottom: 5,
  },
  cardTitleTree: {
    fontSize: 14,
    fontWeight: "bold",
    color: "#1FA64C",
    marginBottom: 5,
  },
  cardTitleWeight: {
    fontSize: 14,
    fontWeight: "bold",
    color: "#4B3838",
    marginBottom: 5,
  },
  cardValue: {
    fontSize: 20,
    fontWeight: "bold",
    color: "#4B3838",
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

const formatNumber = (value: number) => {
  return value.toLocaleString("pt-BR", {
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  });
};

const COLORS = ["#4B3838", "#1FA64C", "#8E44AD", "#F1592A"];

const DashboardPDF = ({
  mode,
  dataLinhaState,
  energiaData,
  aguaData,
  oilData,
  treeData,
  dataResiduos,
  DataResiduosByPev,
  selectedPev,
  selectedPevName,
  selectedTipo,
  clientName,
  startDate,
  endDate,
  currentMonthEnergy,
  currentMonthWater,
  currentMonthOil,
  currentMonthTree,
}: DashboardPDFProps) => {
  const periodLabel =
    startDate || endDate
      ? `${
          startDate ? format(new Date(startDate), "dd/MM/yyyy") : "Início"
        } até ${endDate ? format(new Date(endDate), "dd/MM/yyyy") : "Hoje"}`
      : "Últimos 6 meses";

  const totalWeight = dataLinhaState.reduce((sum, item) => sum + item.peso, 0);
  const totalEnergy = energiaData.reduce((sum, item) => sum + item.mwh, 0);
  const totalWater = aguaData.reduce((sum, item) => sum + item.litros, 0);
  const totalOil = oilData.reduce((sum, item) => sum + item.litros, 0);
  const totalTree = treeData?.reduce((sum, item) => sum + item.value, 0);

  const isAdmin = mode === "admin";
  const isClient = mode === "client";
  const hasSelectedPev = !!selectedPev;

  const showYbyThisMonth =
    isAdmin && !hasSelectedPev && periodLabel === "Últimos 6 meses";

  return (
    <Document>
      <Page size="A4" orientation="landscape" style={styles.page}>
        {/* Header */}
        <View style={styles.header}>
          <View>
            <Text style={styles.title}>
              {mode === "admin" ? "Relatório Geral" : "Relatório do Cliente"}
            </Text>
            <Text style={styles.subtitle}>Período: {periodLabel}</Text>
          </View>

          {/* <Image src="/ybyBlack.png" style={styles.logo} /> */}
        </View>

        {/* Filtros */}
        <View style={styles.filters}>
          {mode === "admin" && (
            <Text style={styles.filterText}>PEV: {selectedPevName || "Todos"}</Text>
          )}

          <Text style={styles.filterText}>
            Tipo de Resíduo: {selectedTipo || "Todos"}
          </Text>

          {mode === "client" && (
            <>
              <Text style={styles.filterText}>Cliente: {clientName}</Text>
            </>
          )}
        </View>

        {/* CARDS DE RESUMO */}
        {isClient ? (
          // 🔹 CLIENTE: nunca vê "Este mês — Yby" e sempre vê TOTAIS do período
          <View style={styles.cardRow}>
            <View style={styles.currentMonthCardWeight}>
              <Text style={styles.cardTitleWeight}>Peso Coletado</Text>
              <Text style={styles.cardValue}>
                {formatNumber(totalWeight)} Kg
              </Text>
            </View>

            <View style={styles.currentMonthCard}>
              <Text style={styles.cardTitleEnergy}>Energia Economizada</Text>
              <Text style={styles.cardValue}>
                {formatNumber(totalEnergy)} MWh
              </Text>
            </View>

            <View style={styles.currentMonthCard}>
              <Text style={styles.cardTitleWater}>Água Economizada</Text>
              <Text style={styles.cardValue}>{formatNumber(totalWater)} L</Text>
            </View>

            <View style={styles.currentMonthCard}>
              <Text style={styles.cardTitleOil}>Petróleo Economizado</Text>
              <Text style={styles.cardValue}>{formatNumber(totalOil)} L</Text>
            </View>

            <View style={styles.currentMonthCard}>
              <Text style={styles.cardTitleTree}>Árvores Poupadas</Text>
              <Text style={styles.cardValue}>
                {formatNumber(totalTree ?? 0)}
              </Text>
            </View>
          </View>
        ) : !hasSelectedPev ? (
          showYbyThisMonth ? (
            // 🔹 ADMIN sem PEV + "Últimos 6 meses" → Este mês — Yby
            <View style={styles.cardRow}>
              <View style={styles.currentMonthCardWeight}>
                <Text style={styles.cardTitleWeight}>Peso Coletado</Text>
                <Text style={styles.cardValue}>
                  {formatNumber(totalWeight)} Kg
                </Text>
              </View>

              <View style={styles.currentMonthCard}>
                <Text style={styles.cardSubtitle}>Este mês — Yby</Text>
                <Text style={styles.cardTitleEnergy}>Energia Economizada</Text>
                <Text style={styles.cardValue}>{currentMonthEnergy} MWh</Text>
              </View>

              <View style={styles.currentMonthCard}>
                <Text style={styles.cardSubtitle}>Este mês — Yby</Text>
                <Text style={styles.cardTitleWater}>Água Economizada</Text>
                <Text style={styles.cardValue}>{currentMonthWater} L</Text>
              </View>

              <View style={styles.currentMonthCard}>
                <Text style={styles.cardSubtitle}>Este mês — Yby</Text>
                <Text style={styles.cardTitleOil}>Petróleo Economizado</Text>
                <Text style={styles.cardValue}>{currentMonthOil} L</Text>
              </View>

              <View style={styles.currentMonthCard}>
                <Text style={styles.cardSubtitle}>Este mês — Yby</Text>
                <Text style={styles.cardTitleTree}>Árvores Poupadas</Text>
                <Text style={styles.cardValue}>{currentMonthTree}</Text>
              </View>
            </View>
          ) : (
            // 🔹 ADMIN sem PEV + outro período → mês atual, sem label "Este mês — Yby"
            <View style={styles.cardRow}>
              <View style={styles.currentMonthCardWeight}>
                <Text style={styles.cardTitleWeight}>Peso Coletado</Text>
                <Text style={styles.cardValue}>
                  {formatNumber(totalWeight)} Kg
                </Text>
              </View>

              <View style={styles.currentMonthCard}>
                <Text style={styles.cardTitleEnergy}>Energia Economizada</Text>
                <Text style={styles.cardValue}>{currentMonthEnergy} MWh</Text>
              </View>

              <View style={styles.currentMonthCard}>
                <Text style={styles.cardTitleWater}>Água Economizada</Text>
                <Text style={styles.cardValue}>{currentMonthWater} L</Text>
              </View>

              <View style={styles.currentMonthCard}>
                <Text style={styles.cardTitleOil}>Petróleo Economizado</Text>
                <Text style={styles.cardValue}>{currentMonthOil} L</Text>
              </View>

              <View style={styles.currentMonthCard}>
                <Text style={styles.cardTitleTree}>Árvores Poupadas</Text>
                <Text style={styles.cardValue}>{currentMonthTree}</Text>
              </View>
            </View>
          )
        ) : (
          // 🔹 ADMIN com selectedPev → totais do período (sem "Este mês — Yby")
          <View style={styles.cardRow}>
            <View style={styles.currentMonthCardWeight}>
              <Text style={styles.cardTitleWeight}>Peso Coletado</Text>
              <Text style={styles.cardValue}>
                {formatNumber(totalWeight)} Kg
              </Text>
            </View>

            <View style={styles.currentMonthCard}>
              <Text style={styles.cardTitleEnergy}>Energia Economizada</Text>
              <Text style={styles.cardValue}>
                {formatNumber(totalEnergy)} MWh
              </Text>
            </View>

            <View style={styles.currentMonthCard}>
              <Text style={styles.cardTitleWater}>Água Economizada</Text>
              <Text style={styles.cardValue}>{formatNumber(totalWater)} L</Text>
            </View>

            <View style={styles.currentMonthCard}>
              <Text style={styles.cardTitleOil}>Petróleo Economizado</Text>
              <Text style={styles.cardValue}>{formatNumber(totalOil)} L</Text>
            </View>

            <View style={styles.currentMonthCard}>
              <Text style={styles.cardTitleTree}>Árvores Poupadas</Text>
              <Text style={styles.cardValue}>
                {formatNumber(totalTree ?? 0)}
              </Text>
            </View>
          </View>
        )}

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
              {/* <Text style={styles.tableCell}>Água (L)</Text> */}
            </View>
            {dataLinhaState.map((item: DataItem, index: number) => (
              <View
                key={index}
                style={[
                  styles.tableRow,
                  index % 2 === 1 ? styles.zebraRow : {},
                ]}
              >
                <Text style={styles.tableCell}>{item.mes}</Text>
                <Text style={styles.tableCell}>{formatNumber(item.peso)}</Text>
                <Text style={styles.tableCell}>
                  {formatNumber(energiaData[index]?.mwh || 0)}
                </Text>
                <Text style={styles.tableCell}>
                  {formatNumber(aguaData[index]?.litros || 0)}
                </Text>
                <Text style={styles.tableCell}>
                  {formatNumber(oilData[index]?.litros || 0)}
                </Text>
                <Text style={styles.tableCell}>
                  {formatNumber(treeData?.[index]?.value ?? 0)}
                </Text>
              </View>
            ))}
          </View>
        </View>

        {/* Distribuição de Resíduos */}
        <View style={styles.wastesDistribution}>
          {!selectedPev ? (
            <>
              {periodLabel === "Últimos 6 meses" ? (
                <>
                  <Text style={styles.summaryTitle}>
                    Distribuição de Resíduos este Mês
                  </Text>
                </>
              ) : (
                <>
                  <Text style={styles.summaryTitle}>
                    Distribuição de Resíduos
                  </Text>
                </>
              )}

              {dataResiduos.map((item: WasteItem, index: number) => (
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
            </>
          ) : (
            <>
              <Text style={styles.summaryTitle}>
                Distribuição de Resíduos do Pev
              </Text>
              {DataResiduosByPev?.map((item: WasteItem, index: number) => (
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
            </>
          )}
        </View>

        <View style={styles.summaryBox}>
          {/* Totais */}
          <View style={styles.totalsRow}>
            <View style={styles.totalsCol}>
              <Text style={styles.summaryTitle}>Totais do Período</Text>
              <Text style={styles.summaryText}>
                Total de Peso Coletado: {formatNumber(totalWeight)} kg
              </Text>
              <Text style={styles.summaryText}>
                Total de Energia Economizada: {formatNumber(totalEnergy)} MWh
              </Text>
              <Text style={styles.summaryText}>
                Total de Água Economizada: {formatNumber(totalWater)} Litros
              </Text>
            </View>

            <View style={styles.totalsCol}>
              <Text style={styles.summaryText}>
                Total de Petróleo Economizado: {formatNumber(totalOil)} Litros
              </Text>
              <Text style={styles.summaryText}>
                Total de Árvores Poupadas: {formatNumber(totalTree ?? 0)}{" "}
              </Text>

              <Text style={styles.summaryText}>
                Total de Meses: {dataLinhaState.length}
              </Text>
              {!selectedPev ? (
                <Text style={styles.summaryText}>
                  Tipos de Resíduos esse mês: {dataResiduos.length}
                </Text>
              ) : (
                <Text style={styles.summaryText}>
                  Tipos de Resíduos esse mês: {DataResiduosByPev?.length}
                </Text>
              )}
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
