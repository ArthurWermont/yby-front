import ArrowDownwardIcon from "@mui/icons-material/ArrowDownward";
import ArrowUpwardIcon from "@mui/icons-material/ArrowUpward";
import { Button, IconButton, TextField, Typography } from "@mui/material";
import { styled } from "@mui/system";
import { useContext, useEffect, useState } from "react";
import { getCollection, getCollectionClient } from "../api/collection";
import { AuthContext } from "../context/auth-context";
import TableComponent from "./components/basic-table";
import GenerateExcel from "./components/excel";
import GeneratePDF from "./components/pdf";

const StyledContainer = styled("div")({
  display: "flex",
  flexDirection: "column",
  minHeight: "100vh",
  height: "100%",
  width: "100%",
});

const StyledCenterContainer = styled("div")({
  padding: "50px 40px 0",
});

const StyledActionsContainer = styled("div")({
  display: "flex",
  justifyContent: "space-between",
  alignItems: "center",
  marginBottom: "20px",
  flexWrap: "wrap",
  gap: "16px",
});

const StyledEmptyMessage = styled("div")({
  textAlign: "center",
  marginTop: "20px",
  fontSize: "18px",
  color: "#9b9794",
});

const StyledButton = styled(Button)({
  backgroundColor: "#15853B",
  color: "#fff",
  textTransform: "none",
});

export default function Reports() {
  const [collections, setCollections] = useState<any>([]);
  const [filteredCollections, setFilteredCollections] = useState<any>([]);
  const [searchTerm, setSearchTerm] = useState<string>("");

  const { user: currentUser } = useContext(AuthContext);

  const isClient = !!currentUser?.client_id;

  const formatCollection = (data: any) => {
    const formattedData = data.map((collection: any) => {
      const wastes =
        collection?.wastes.map((item: any) => item.name).join(", ") || "";

      const wastesIds = collection?.wastes.map((item: any) => item.id);

      return {
        documentId: collection.documentId,
        id: collection.id || "",
        pev: collection?.client?.social_name || "",
        waste: wastes || "",
        weight: collection?.weight || "",
        createdAt: collection?.createdAt || "",
        imageAvaria: collection?.breakdown?.url || "",
        imageColectorUrl: collection.colector?.url || "",
        wastesIds: wastesIds || [],
        cooperative: collection?.cooperative || "",
      };
    });

    const OrderByDate = formattedData.sort((a: any, b: any) => {
      const dateA = new Date(a.createdAt);
      const dateB = new Date(b.createdAt);
      return dateB.getTime() - dateA.getTime();
    });

    return OrderByDate;
  };

  useEffect(() => {
    if (isClient) {
      const getCollectionsData = async () => {
        const response = await getCollectionClient({
          documentId: currentUser?.client_id,
        });
        const formattedData = formatCollection(response.data);
        setCollections(formattedData);
        setFilteredCollections(formattedData);
      };
      getCollectionsData();
    } else {
      const getCollectionsData = async () => {
        const response = await getCollection();

        const formattedData = formatCollection(response);
        setCollections(formattedData);
        setFilteredCollections(formattedData);
      };

      getCollectionsData();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // Função para reordenar por data crescente
  const handleReorderByDateAscending = () => {
    const reordered = [...filteredCollections].sort((a: any, b: any) => {
      const dateA = new Date(a.createdAt);
      const dateB = new Date(b.createdAt);
      return dateA.getTime() - dateB.getTime(); // Ordem crescente
    });
    setFilteredCollections(reordered);
  };

  // Função para reordenar por data decrescente
  const handleReorderByDateDescending = () => {
    const reordered = [...filteredCollections].sort((a: any, b: any) => {
      const dateA = new Date(a.createdAt);
      const dateB = new Date(b.createdAt);
      return dateB.getTime() - dateA.getTime(); // Ordem decrescente
    });
    setFilteredCollections(reordered);
  };

  // Função para buscar por nome
  const handleSearchByName = (event: React.ChangeEvent<HTMLInputElement>) => {
    const term = event.target.value.toLowerCase();
    setSearchTerm(term);

    const filtered = collections.filter(
      (collection: any) =>
        collection.pev.toLowerCase().includes(term) ||
        collection.waste.toLowerCase().includes(term) || // Tipo de Resíduos
        (typeof collection.cooperative === "string"
          ? collection.cooperative.toLowerCase().includes(term)
          : collection.cooperative?.cooperative_name
              ?.toLowerCase()
              .includes(term))
    );

    setFilteredCollections(filtered);
  };

  const [startDate, setStartDate] = useState<string>("");
  const [endDate, setEndDate] = useState<string>("");

  const handleFilterByDate = () => {
    if (!startDate || !endDate) return;

    const filtered = collections.filter((collection: any) => {
      const collectionDate = new Date(collection.createdAt);
      return (
        collectionDate >= new Date(startDate) &&
        collectionDate <= new Date(endDate)
      );
    });

    setFilteredCollections(filtered);
  };

  return (
    <StyledContainer>
      <StyledCenterContainer>
        <Typography
          style={{ fontSize: "32px", fontWeight: "600", color: "#4B3838" }}
        >
          Relatórios
        </Typography>

        {/* Ações (Exportação e Filtros) */}
        <StyledActionsContainer>
          <div style={{ display: "flex", gap: "16px", alignItems: "center" }}>
            <TextField
              label="Buscar"
              variant="outlined"
              value={searchTerm}
              onChange={handleSearchByName}
              size="small"
              style={{ width: "300px" }}
            />
            <TextField
              label="Data Inicial"
              type="date"
              value={startDate}
              onChange={(e) => setStartDate(e.target.value)}
              InputLabelProps={{ shrink: true }}
              size="small"
            />
            <TextField
              label="Data Final"
              type="date"
              value={endDate}
              onChange={(e) => setEndDate(e.target.value)}
              InputLabelProps={{ shrink: true }}
              size="small"
            />
            <StyledButton onClick={handleFilterByDate}>
              Filtrar por Data
            </StyledButton>
            <IconButton
              onClick={handleReorderByDateAscending}
              style={{ backgroundColor: "#15853B", color: "#fff" }}
            >
              <ArrowUpwardIcon />
            </IconButton>
            <IconButton
              onClick={handleReorderByDateDescending}
              style={{ backgroundColor: "#15853B", color: "#fff" }}
            >
              <ArrowDownwardIcon />
            </IconButton>
          </div>
          <div style={{ display: "flex", gap: "16px" }}>
            <GeneratePDF collections={filteredCollections} />
            <GenerateExcel collections={filteredCollections} />
          </div>
        </StyledActionsContainer>

        {/* Verifica se há resultados */}
        {filteredCollections.length > 0 ? (
          <TableComponent collections={filteredCollections} />
        ) : (
          <StyledEmptyMessage>
            Nenhum resultado encontrado para o filtro aplicado.
          </StyledEmptyMessage>
        )}
      </StyledCenterContainer>
    </StyledContainer>
  );
}
