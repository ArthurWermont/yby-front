import {
  Document,
  Image,
  Page,
  PDFViewer,
  StyleSheet,
  Text,
  View,
} from "@react-pdf/renderer";
import { format } from "date-fns";
import { useEffect, useState } from "react";
import { useSearchParams } from "react-router-dom";
import { createGlobalStyle } from "styled-components";
import { reportService } from "../../services/Report.service";

// Estilos do PDF
const styles = StyleSheet.create({
  page: {
    backgroundColor: "#fff",
    padding: 20,
  },
  header: {
    flexDirection: "row",
    justifyContent: "flex-end",
    alignItems: "center",
    marginBottom: 5,
  },
  logo: {
    width: 90,
    height: 90,
    marginBottom: 8,
  },
  section: {
    marginTop: 10,
    marginBottom: 10,
  },
  title: {
    fontSize: 22,
    fontWeight: "bold",
    textAlign: "center",
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

// Componente para gerar o PDF
const MyDocument = ({ rows }: any) => {
  const totalWeight = rows.reduce(
    (sum: number, row: any) =>
      sum + parseFloat(`${row.weight ?? 0}`.replace(",", ".")),
    0,
  );

  return (
    <Document>
      <Page style={styles.page}>
        <View style={{ alignItems: "center", marginBottom: 25 }}>
          <Image src="/ybyBlack.png" style={styles.logo} />{" "}
          <Text style={styles.title}>Relatório de Coleta de Resíduos</Text>
          <Text style={{ fontSize: 11, textAlign: "center", color: "#444" }}>
            Dados consolidados das coletas realizadas
          </Text>
        </View>

        {/* Tabela */}
        <View style={styles.table}>
          {/* Cabeçalho da Tabela */}
          <View style={styles.tableHeader}>
            <Text style={styles.tableCell}>Data | Horário</Text>
            <Text style={styles.tableCell}>PEV</Text>
            <Text style={styles.tableCell}>Tipo de Resíduos</Text>
            <Text style={styles.tableCell}>Coleta (Kg/L)</Text>
            <Text style={styles.tableCell}>Cooperativa</Text>
            <Text style={styles.tableCell}>Avaria</Text>
          </View>

          {/* Corpo da Tabela */}
          {rows.map((row: any) => (
            <View key={row.id} style={styles.tableRow}>
              <Text style={styles.tableCell}>{row.createdAt}</Text>
              <Text style={styles.tableCell}>{row.pev}</Text>
              <Text style={styles.tableCell}>{row.waste}</Text>
              <Text style={styles.tableCell}>{row.weight}</Text>
              <Text style={styles.tableCell}>{row.cooperative}</Text>
              <Text style={styles.tableCellNoBorder}>{row.hasAvaria}</Text>
            </View>
          ))}
        </View>
        <View style={styles.section}>
          <Text style={styles.text}>
            Peso Total das Coletas: {totalWeight} Kilos ou Litros
          </Text>
          <Text style={styles.text}>Total de Coletas: {rows.length}</Text>
          <Text style={styles.text}>
            Total de Avarias:{" "}
            {rows.filter((row: any) => row.hasAvaria === "Sim").length}
          </Text>
          <Text style={styles.text}>
            Total de Resíduos:{" "}
            {rows.reduce((acc: any, row: any) => acc + row.wastes.length, 0)}
          </Text>
        </View>
        <View style={styles.section}>
          <Text style={styles.text}>
            Este relatório foi gerado automaticamente e contém informações
            precisas sobre as coletas realizadas.
          </Text>
        </View>
        <View style={styles.section}>
          <Text style={styles.text}>
            Data de Geração: {format(new Date(), "dd/MM/yyyy | HH:mm")}
          </Text>
        </View>
      </Page>
    </Document>
  );
};

// Componente que cria o link de download para o PDF
const GeneratePDF = () => {
  const [params] = useSearchParams();
  const [rows, setRows] = useState<any[]>([]);

  const fetchAll = async (page = 1, limit = 500, items = []) => {
    try {
      const { data: reportData, meta } = await reportService.getData({
        documentId: params.get("doc") || "",
        isAdmin: params.get("client") === "false",
        page,
        limit: 100,
        search: {
          startDate: params.get("start") || "",
          endDate: params.get("end") || "",
          pev: params.get("pev") || "",
          waste: params.get("waste") || "",
          sortByDate: "desc",
        },
      });

      const accItems = [...items, ...reportData];
      const hasMore = accItems.length < meta.pagination.total;
      if (hasMore) {
        return await fetchAll(page + 1, limit, accItems as any);
      }

      return accItems;
    } catch (error) {}
  };

  useEffect(() => {
    (async () => {
      try {
        const collections = await fetchAll();
        // Formatação das coleções para os dados
        const rowsCollection = collections?.map((collection: any) => {
          const wastesName =
            collection?.wastes.map((item: any) => item.name).join(", ") || "";
          return {
            documentId: collection.documentId,
            id: collection.id,
            pev: collection.client.social_name,
            waste: wastesName,
            weight: collection.weight,
            createdAt: format(
              new Date(collection.createdAt),
              "dd/MM/yyyy | HH:mm",
            ),
            hasAvaria: Boolean(collection?.breakdown?.url) ? "Sim" : "Não",
            wastes: collection.wastes,
            cooperative: collection?.cooperative?.cooperative_name,
          };
        });
        setRows(rowsCollection as any);
      } catch (error) {}
    })();
  }, []);

  if (rows.length === 0) {
    return "carregando";
  }

  return (
    <>
      <GlobalStyles />
      <PDFViewer>
        <MyDocument rows={rows} />
      </PDFViewer>
    </>
  );
};

const GlobalStyles = createGlobalStyle`
  #root{
    height:100vh;
    width:100vw;
    overflow:hidden;
    >iframe{
    height:100%;
    width:100%;
    }
  }
`;

export default GeneratePDF;
