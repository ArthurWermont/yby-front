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
    search: { startDate, endDate, pev, waste },
  } = useReportsContext();
  const { user: currentUser } = useContext(AuthContext);

  const fetchAll = async (page = 1, limit = 500, items = []) => {
    try {
      const { data: reportData, meta } = await reportService.getData({
        documentId: currentUser?.documentId || "",
        isAdmin: currentUser?.isAdmin,
        page,
        limit: 100,
        search: {
          startDate,
          endDate,
          pev,
          waste,
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
          new Date(collection.createdAt),
          "dd/MM/yyyy | HH:mm",
        ),
        PEV: collection.client.social_name,
        "Tipo de Resíduos": wastesName,
        "Coleta (kg)": collection.weight,
        Cooperativa: collection.cooperative.cooperative_name,
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

    const total = dataSheet?.reduce((acc, cur) => {
      acc = acc + +cur["Coleta (kg)"];
      return acc;
    }, 0);

    XLSX.utils.sheet_add_aoa(
      worksheetResume,
      [[], [`Peso Total das Coletas: ${total}`]],
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

      const total = data?.reduce((acc, cur) => {
        acc = acc + +cur["Coleta (kg)"];
        return acc;
      }, 0);

      XLSX.utils.sheet_add_aoa(
        worksheet,
        [[], [`Peso Total das Coletas: ${total}`]],
        { origin: `A${data!.length + 2}` },
      );

      XLSX.utils.book_append_sheet(workbook, worksheet, type);
    });

    XLSX.writeFile(workbook, "relatorio_coleta.xlsx");
  };
  return <StyledButton onClick={createSheet}>Exportar para Excel</StyledButton>;
};

export default GenerateExcel;
