import { Button } from "@mui/material";
import { styled } from "@mui/system";

const StyledButton = styled(Button)({
  backgroundColor: "#15853B",
  color: "#fff",
  textTransform: "none",
  "&:hover": {
    backgroundColor: "#15853B",
  },
});

export const Exports = () => {
  return (
    <div id="exports">
      {/* <GeneratePDF collections={filteredCollections} />
        <GenerateExcel collections={filteredCollections} /> */}
      <StyledButton>Exportar para PDF</StyledButton>
      <StyledButton>Exportar para Excel</StyledButton>
    </div>
  );
};
