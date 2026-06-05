import { Button } from "@mui/material";
import { styled } from "@mui/system";
import { format } from "date-fns";
import { useContext } from "react";
import * as XLSX from "xlsx";
import { AuthContext } from "../../context/auth-context";
import { reportService } from "../../services/Report.service";
import { useReportsContext } from "../context";

const StyledButton = styled(Button)({
  backgroundColor: "#15853B",
  color: "#fff",
  textTransform: "none",
  "&:hover": {
    backgroundColor: "#15853B",
  },
});

const GenerateExcel = () => {
  const {
    search: { startDate, endDate, pev, waste, cooperative, selectedClient },
  } = useReportsContext();
  const { user: currentUser } = useContext(AuthContext);

  const fetchAll = async (page = 1, limit = 500, items = []) => {
    try {
      const isAdmin = !!currentUser?.isAdmin;
      const isManager = !!currentUser?.isManager;
      const isClient = !!currentUser?.client_id;

      const managerClientIds = isManager
        ? (currentUser?.manager?.clients ?? [])
            .map((client: any) => client.documentId)
            .filter((id: string | undefined): id is string => !!id)
        : [];
        
      const { data: reportData, meta } = await reportService.getData({
        documentId: isClient ? currentUser?.client_id || "" : "",
        isAdmin,
        isManager,
        managerClientIds,
        page,
        limit: 100,
        search: {
          startDate,
          endDate,
          pev,
          cooperative,
          waste,
          sortByDate: "desc",
          selectedClient,
        },
      });

      const accItems = [...items, ...reportData];
      const hasMore = accItems.length < meta.pagination.total;
      if (hasMore) {
        return await fetchAll(page + 1, limit, accItems as any);
      }

      return accItems;
    } catch (error) {
      console.error("Erro ao exportar Excel:", error);
      return [];
    }
  };

  const sum = (data: any[] = [], key: string) => {
    return data.reduce((acc, cur) => {
      const valueFormatted = `${cur[key] ?? 0}`.replace(",", ".");
      acc = acc + parseFloat(valueFormatted);
      return acc;
    }, 0);
  };

  const createSheet = async () => {
    const workbook = XLSX.utils.book_new();
    const collections = await fetchAll();
    const wastesTypes = [
      ...new Set(
        collections?.flatMap((item) =>
          item.wastes.map((waste: any) => waste.name),
        ),
      ),
    ].sort();

    const dataSheet = collections?.map((collection: any) => {
      const wastesName =
        collection?.wastes.map((item: any) => item.name).join(", ") || "";

      return {
        "Data | Horário": format(
          new Date(collection.collection_date),
          "dd/MM/yyyy | HH:mm",
        ),
        PEV: collection.client.social_name,
        "Tipo de Resíduos": wastesName,
        "Coleta (kg)": collection.weight,
        Cooperativa: collection?.cooperative?.cooperative_name,
        Avaria: Boolean(collection?.breakdown?.url) ? "Sim" : "Não",
      };
    });

    const worksheetResume = XLSX.utils.json_to_sheet(dataSheet as any);

    const colunas = [
      { wch: 20 }, // Data
      { wch: 15 }, // PEV
      { wch: 15 }, // Tipo de Resíduo
      { wch: 10 }, // Coleta
      { wch: 15 }, // Cooperativa
      { wch: 30 }, // Avaria
    ];
    worksheetResume["!cols"] = colunas;

    const total = sum(dataSheet, "Coleta (kg)");

    XLSX.utils.sheet_add_aoa(
      worksheetResume,
      [[], [`Peso Total das Coletas: ${total.toFixed(2)}`]],
      { origin: `A${dataSheet!.length + 2}` },
    );

    XLSX.utils.book_append_sheet(workbook, worksheetResume, "Resumo");

    wastesTypes.forEach((type) => {
      const data = dataSheet?.filter((t) =>
        t["Tipo de Resíduos"].includes(type),
      );
      const worksheet = XLSX.utils.json_to_sheet(data as any);

      const colunas = [
        { wch: 20 }, // Data
        { wch: 15 }, // PEV
        { wch: 15 }, // Tipo de Resíduo
        { wch: 10 }, // Coleta
        { wch: 15 }, // Cooperativa
        { wch: 30 }, // Avaria
      ];

      worksheet["!cols"] = colunas;

      const total = sum(data, "Coleta (kg)");

      XLSX.utils.sheet_add_aoa(
        worksheet,
        [[], [`Peso Total das Coletas: ${total.toFixed(2)}`]],
        { origin: `A${data!.length + 2}` },
      );

      XLSX.utils.book_append_sheet(workbook, worksheet, type);
    });

    XLSX.writeFile(workbook, "relatorio_coleta.xlsx");
  };
  return <StyledButton onClick={createSheet}>Exportar para Excel</StyledButton>;
};

export default GenerateExcel;
