import { Button } from "@mui/material";
import { styled } from "@mui/system";
import * as XLSX from "xlsx";

const StyledButton = styled(Button)({
  backgroundColor: "#15853B",
  color: "#fff",
  textTransform: "none",
  "&:hover": {
    backgroundColor: "#15853B",
  },
});

const GenerateExcel = ({ collections }: any) => {
  // Função para exportar os dados para Excel
  const exportarParaExcel = () => {
    // Formatar os dados para exportação
    const dados = collections.map((collection: any) => ({
      "Data | Horário": collection.createdAt,
      PEV: collection.pev,
      "Tipo de Resíduos": collection.waste,
      "Coleta (kg)": collection.weight,
      Avaria: collection.imageAvaria ? "Sim" : "Não",
    }));

    // Criar uma planilha a partir dos dados
    const ws = XLSX.utils.json_to_sheet(dados);

    // Criar um arquivo de Excel
    const wb = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(wb, ws, "Relatório");

    // Exportar o arquivo Excel com o nome "relatorio_de_coleta.xlsx"
    XLSX.writeFile(wb, "relatorio_de_coleta.xlsx");
  };

  return (
    <StyledButton onClick={exportarParaExcel}>Exportar para Excel</StyledButton>
  );
};

export default GenerateExcel;
