import { Document, Page, StyleSheet, Text, View } from "@react-pdf/renderer";
import { format } from "date-fns";

interface DataItem {
  mes: string;
  peso: number;
}

interface EnergyItem {
  mes: string;
  mwh: number;
}

interface DashboardPDFProps {
  dataLinhaState: DataItem[];
  energiaData: EnergyItem[];
  selectedPev: string | null;
  selectedTipo: string | null;
  startDate: string;
  endDate: string;
}

const styles = StyleSheet.create({
  page: {
    backgroundColor: "#fff",
    padding: 30,
  },
  header: {
    flexDirection: "row",
    justifyContent: "space-between",
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
    backgroundColor: "#FAF1E8",
    fontWeight: "bold",
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
  }
});

const formatNumber = (value: number) => {
  return value.toLocaleString('pt-BR', { minimumFractionDigits: 2, maximumFractionDigits: 2 });
};

const DashboardPDF = ({ 
  dataLinhaState, 
  energiaData,
  selectedPev,
  selectedTipo,
  startDate,
  endDate 
}: DashboardPDFProps) => {
  const totalWeight = dataLinhaState.reduce((sum: number, item: DataItem) => sum + item.peso, 0);
  const totalEnergy = energiaData.reduce((sum: number, item: EnergyItem) => sum + item.mwh, 0);
  
  return (
    <Document>
      <Page size="A4" orientation="landscape" style={styles.page}>
        <View style={styles.header}>
          <Text style={styles.title}>Relatório do Dashboard</Text>
        </View>

        <View style={styles.filters}>
          <Text style={styles.filterText}>
            Período: {startDate ? format(new Date(startDate), 'dd/MM/yyyy') : 'Início'} até {endDate ? format(new Date(endDate), 'dd/MM/yyyy') : 'Hoje'}
          </Text>
          <Text style={styles.filterText}>
            PEV: {selectedPev || 'Todos'}
          </Text>
          <Text style={styles.filterText}>
            Tipo de Resíduo: {selectedTipo || 'Todos'}
          </Text>
        </View>

        <View style={styles.section}>
          <Text style={styles.summaryTitle}>
            Resumo das Coletas
          </Text>
          <View style={[styles.table, { marginTop: 10 }]}>
            <View style={[styles.tableRow, styles.tableHeader]}>
              <Text style={styles.tableCell}>Mês</Text>
              <Text style={styles.tableCell}>Peso (kg)</Text>
              <Text style={styles.tableCell}>Energia Economizada (MWh)</Text>
            </View>
            {dataLinhaState.map((item: DataItem, index: number) => (
              <View key={index} style={styles.tableRow}>
                <Text style={styles.tableCell}>{item.mes}</Text>
                <Text style={styles.tableCell}>{formatNumber(item.peso)}</Text>
                <Text style={styles.tableCell}>{formatNumber(energiaData[index]?.mwh || 0)}</Text>
              </View>
            ))}
          </View>
        </View>

        <View style={styles.summaryBox}>
          <Text style={styles.summaryTitle}>Totais do Período</Text>
          <Text style={styles.summaryText}>Total de Peso Coletado: {formatNumber(totalWeight)} kg</Text>
          <Text style={styles.summaryText}>Total de Energia Economizada: {formatNumber(totalEnergy)} MWh</Text>
          <Text style={styles.summaryText}>Total de Meses: {dataLinhaState.length}</Text>
        </View>

        <Text style={styles.footer}>
          Relatório gerado em {format(new Date(), 'dd/MM/yyyy HH:mm')} | YBY Reciclagem
        </Text>
      </Page>
    </Document>
  );
};

export default DashboardPDF;