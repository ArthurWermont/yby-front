import {
  Document,
  Page,
  PDFDownloadLink,
  StyleSheet,
  Text,
  View,
} from "@react-pdf/renderer";
import { format } from "date-fns";
import { Button } from "@mui/material";
import { styled } from "@mui/system";

// Estilos do PDF
const styles = StyleSheet.create({
  page: {
    backgroundColor: "#fff",
    padding: 20,
  },
  section: {
    marginBottom: 10,
  },
  title: {
    fontSize: 24,
    textAlign: "center",
    marginBottom: 20,
  },
  text: {
    fontSize: 12,
    textAlign: "left",
  },
  table: {
    width: "100%",
    marginTop: 10,
    borderStyle: "solid",
    borderWidth: 1,
    borderColor: "#000",
    borderRadius: 5,
  },
  tableHeader: {
    flexDirection: "row",
    backgroundColor: "#f0f0f0",
    padding: 5,
    fontWeight: "bold",
    borderBottomWidth: 1,
    borderBottomColor: "#000",
  },
  tableRow: {
    flexDirection: "row",
    padding: 5,
    borderBottomWidth: 1,
    borderBottomColor: "#e0e0e0",
  },
  tableCell: {
    flex: 1,
    textAlign: "center",
    fontSize: 10,
    padding: 3,
    borderRightWidth: 1,
    borderRightColor: "#e0e0e0",
  },
  tableCellNoBorder: {
    flex: 1,
    textAlign: "center",
    fontSize: 10,
    padding: 3,
  },
});

// Estilo do botão
const StyledButton = styled(Button)({
  backgroundColor: "#15853B",
  color: "#fff",
  textTransform: "none",
  "&:hover": {
    backgroundColor: "#15853B",
  },
});

// Componente para gerar o PDF
const MyDocument = ({ rows }: any) => (
  <Document>
    <Page style={styles.page}>
      <Text style={styles.title}>Relatório de Coleta de Resíduos</Text>
      <View style={styles.section}>
        <Text style={styles.text}>
          Este é o relatório de coleta de resíduos, contendo detalhes sobre cada
          coleta realizada.
        </Text>
      </View>

      {/* Tabela */}
      <View style={styles.table}>
        {/* Cabeçalho da Tabela */}
        <View style={styles.tableHeader}>
          <Text style={styles.tableCell}>Data | Horário</Text>
          <Text style={styles.tableCell}>PEV</Text>
          <Text style={styles.tableCell}>Tipo de Resíduos</Text>
          <Text style={styles.tableCell}>Coleta (kg)</Text>
          <Text style={styles.tableCell}>Avaria</Text>
        </View>

        {/* Corpo da Tabela */}
        {rows.map((row: any) => (
          <View key={row.id} style={styles.tableRow}>
            <Text style={styles.tableCell}>{row.createdAt}</Text>
            <Text style={styles.tableCell}>{row.pev}</Text>
            <Text style={styles.tableCell}>{row.waste}</Text>
            <Text style={styles.tableCell}>{row.weight}</Text>
            <Text style={styles.tableCellNoBorder}>{row.hasAvaria}</Text>
          </View>
        ))}
      </View>
    </Page>
  </Document>
);

// Componente que cria o link de download para o PDF
const GeneratePDF = ({ collections }: any) => {
  // Formatação das coleções para os dados
  const rows = collections.map((collection: any) => ({
    documentId: collection.documentId,
    id: collection.id,
    pev: collection.pev,
    waste: collection.waste,
    weight: collection.weight,
    createdAt: format(new Date(collection.createdAt), "dd/MM/yyyy | HH:mm"),
    hasAvaria: collection.imageAvaria ? "Sim" : "Não",
    imageAvaria: collection.imageAvaria,
    imageColectorUrl: collection.imageColectorUrl,
    wastesIds: collection.wastesIds,
  }));

  return (
    <PDFDownloadLink
      document={<MyDocument rows={rows} />}
      fileName="relatorio_de_coleta.pdf"
    >
      {({ loading }) => (
        <StyledButton>
          {loading ? "Carregando..." : "Exportar para PDF"}
        </StyledButton>
      )}
    </PDFDownloadLink>
  );
};

export default GeneratePDF;
