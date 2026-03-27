import {
  Box,
  Button,
  CircularProgress,
  Divider,
  Typography,
} from "@mui/material";
import { PDFDownloadLink } from "@react-pdf/renderer";
import { useState } from "react";
import { styled as styledComponents } from "styled-components";
import ByWaste from "./byWaste";
import { useDashboardContext } from "./context";
import Filters from "./filters";
import LineGraph from "./lineGraph";
import LineGraphEnergy from "./lineGraphEnergy";
import LineGraphWater from "./lineGraphWater";
import DashboardPDF from "./pdf";
import TreeOilBoxes from "./TreeOilBoxes";
import BoxesWaterEnergy from "./WaterEnergyBoxes";
// Estilizações
const StyledContainer = styledComponents.div`
  display: flex;
  flex-direction: column;
  min-height: 100vh;
  height: 100%;
  width: 100%;
`;

const StyledCenterContainer = styledComponents.div`
  padding: 50px 40px 0;
`;

export default function DashAdmin() {
  const [loading, setLoading] = useState(false);
  const {
    report,
    mode,
    startDate,
    endDate,
    pev: pevId,
    pevName,
    waste,
    wasteName
  } = useDashboardContext();

  // const isReportReady =
  //   !!startDate &&
  //   !!endDate &&
  //   // se pevId for obrigatório, inclua: !!pevId &&
  //   Array.isArray(report.weightByMonth) &&
  //   Array.isArray(report.waterByMonth) &&
  //   Array.isArray(report.energyByMonth) &&
  //   Array.isArray(report.oilBymonth) &&
  //   Array.isArray(report.treeByMonth) &&
  //   typeof report.weightSummary === "number" &&
  //   typeof report.waterSummary === "number" &&
  //   typeof report.energySummary === "number" &&
  //   typeof report.oilSummary === "number" &&
  //   typeof report.treeSummary === "number";

  return (
    <StyledContainer>
      <StyledCenterContainer>
        {loading ? (
          <Box
            display="flex"
            flexDirection="column"
            justifyContent="center"
            alignItems="center"
            minHeight="300px"
            gap={2}
          >
            <CircularProgress size={48} thickness={4} color="success" />
            <Typography variant="body1" color="textSecondary">
              Carregando dados do Dashboard...
            </Typography>
          </Box>
        ) : (
          <>
            <div
              style={{
                display: "flex",
                justifyContent: "space-between",
                alignItems: "center",
              }}
            >
              <Typography
                style={{
                  fontSize: "32px",
                  fontWeight: "600",
                  color: "#4B3838",
                }}
              >
                Dashboard
              </Typography>

              <PDFDownloadLink
                document={
                  <DashboardPDF
                    mode={mode}
                    startDate={startDate}
                    endDate={endDate}
                    pevId={pevId}
                    pevName={pevName}
                    waste={waste}
                    wasteName={wasteName}
                    {...report}
                  />
                }
                fileName="dashboard-report.pdf"
              >
                {({ loading }) => (
                  <Button
                    variant="contained"
                    sx={{
                      backgroundColor: "#2E7D32",
                      textTransform: "none",
                      fontWeight: 500,
                    }}
                    disabled={loading /* || !isReportReady */}
                  >
                    {loading ? "Gerando..." : "BAIXAR DASHBOARD"}
                  </Button>
                )}
              </PDFDownloadLink>
            </div>
            <Divider style={{ marginTop: 8, marginBottom: 24 }} />

            <Filters />
            <Box
              sx={{
                display: "flex",
                gap: 1.8,
                justifyContent: "flex-start",
                flexWrap: "wrap",
                marginTop: 2,
              }}
            >
              <BoxesWaterEnergy />
            </Box>

            <Box
              sx={{
                display: "grid",
                gridTemplateColumns: "1fr 1fr",
                gap: 3,
                marginTop: 4,
                marginBottom: 4,
              }}
            >
              {/* Coleta em peso (linha) */}
              <LineGraph />
              {/* Gráfico de Pizza + Economia */}
              <Box
                sx={{
                  display: "grid",
                  gridTemplateColumns: "1fr 1fr",
                  gap: 2,
                }}
              >
                <ByWaste />
                <TreeOilBoxes />
              </Box>
              {/* Economia de Agua */}
              <LineGraphWater />
              {/* Economia de Energia */}
              <LineGraphEnergy />
            </Box>
          </>
        )}
      </StyledCenterContainer>
    </StyledContainer>
  );
}
