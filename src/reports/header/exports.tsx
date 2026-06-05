import { Button } from "@mui/material";
import { styled } from "@mui/system";
import { Link } from "react-router-dom";
import { useReportsContext } from "../context";
import qs from "qs";
import { useContext } from "react";
import { AuthContext } from "../../context/auth-context";
import GenerateExcel from "../exports/excel";

const StyledButton = styled(Button)({
  backgroundColor: "#15853B",
  color: "#fff",
  textTransform: "none",
  "&:hover": {
    backgroundColor: "#15853B",
  },
});

export const Exports = () => {
  const {
    search: { startDate, endDate, pev, waste, cooperative, selectedClient },
  } = useReportsContext();
  const { user: currentUser } = useContext(AuthContext);
  const isClient = !!currentUser?.client_id;
  const isManager = !!currentUser?.isManager;
  const isAdmin = !!currentUser?.isAdmin;

  const query = qs.stringify({
    doc: currentUser?.client_id || "",
    end: endDate,
    start: startDate,
    client: isClient,
    manager: isManager,
    admin: isAdmin,
    pev,
    waste,
    cooperative,
    selectedClient,
  });

  return (
    <div id="exports">
      {/* <GeneratePDF collections={filteredCollections} />
        <GenerateExcel collections={filteredCollections} /> */}
      <Link
        to={{ pathname: "/relatorios/pdf", search: `?${query}` }}
        target="_blank"
        rel="noopener noreferrer"
      >
        <StyledButton>Exportar para PDF</StyledButton>
      </Link>

      {/* <StyledButton>Exportar para Excel</StyledButton> */}
      <GenerateExcel />
    </div>
  );
};
