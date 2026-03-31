import {
  Cloud,
  EnergySavingsLeaf,
  Savings,
  WaterDrop,
} from "@mui/icons-material";
import InfoOutlinedIcon from "@mui/icons-material/InfoOutlined";
import { Box, IconButton, Paper, Tooltip, Typography } from "@mui/material";
import { type FC, memo, useEffect, useState } from "react";
import {
  getDashboardSummaryCO2,
  getDashboardSummaryEnergy,
  getDashboardSummaryWater,
} from "../api/dashboard";
import { useDashboardContext } from "./context";

const BoxesWaterEnergy: FC = (props) => {
  const {
    startDate,
    endDate,
    pev: pevId,
    waste: wasteId,
    setReport,
  } = useDashboardContext();
  const [summaryWater, setSummaryWater] = useState<any>(0);
  const [summaryEnergy, setSummaryEnergy] = useState<any>(0);
  const [summaryCO2, setSummaryCO2] = useState<any>(0);
  const [summaryCO2Value, setSummaryCO2Value] = useState<any>(0);

  useEffect(() => {
    const fetchSummaryWater = async () => {
      const response = await getDashboardSummaryWater({
        start: startDate,
        end: endDate,
        pevId,
        wasteId,
      });

      setSummaryWater(response.data.totalWater);
      setReport({ waterSummary: response.data.totalWater });
    };

    const fetchSummaryEnergy = async () => {
      const response = await getDashboardSummaryEnergy({
        start: startDate,
        end: endDate,
        pevId,
        wasteId,
      });

      setSummaryEnergy(response.data.totalEnergy);
      setReport({ energySummary: response.data.totalEnergy });
    };

    const fetchSummaryCO2 = async () => {
      const response = await getDashboardSummaryCO2({
        start: startDate,
        end: endDate,
        pevId,
        wasteId,
      });

      setSummaryCO2(response.data.totalCO2);
      setSummaryCO2Value(response.data.monetaryValue);
      setReport({ cO2Summary: response.data.totalCO2 });
      setReport({ cO2SummaryValue: response.data.monetaryValue });
    };

    fetchSummaryWater();
    fetchSummaryEnergy();
    fetchSummaryCO2();
  }, [pevId, startDate, endDate, wasteId]);

  const formatNumber = (value: number) => {
    return value.toLocaleString("pt-BR", {
      minimumFractionDigits: 2,
      maximumFractionDigits: 2,
    });
  };

  return (
    <>
      <Paper
        sx={{
          display: "flex",
          alignItems: "center",
          gap: 2,
          padding: "12px 16px",
          borderRadius: 3,
          backgroundColor: "#FAF1E8",
          width: 250,
        }}
        elevation={1}
      >
        <Box
          sx={{
            backgroundColor: "#F1592A",
            padding: 1.5,
            borderRadius: "50%",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            width: 44,
            height: 44,
          }}
        >
          <EnergySavingsLeaf sx={{ color: "white", fontSize: 22 }} />
        </Box>
        <Box>
          <Typography variant="caption" color="gray"></Typography>

          <Typography fontWeight={600} fontSize={14}>
            Consumo de Energia
          </Typography>
          <Typography fontWeight={700} fontSize={16}>
            {formatNumber(summaryEnergy)} MWh
          </Typography>
        </Box>
      </Paper>

      {/* CARD 2 */}
      <Paper
        sx={{
          display: "flex",
          alignItems: "center",
          gap: 2,
          padding: "12px 16px",
          borderRadius: 3,
          backgroundColor: "#FAF1E8",
          width: 250,
          marginLeft: 1,
        }}
        elevation={1}
      >
        <Box
          sx={{
            backgroundColor: "#005C87",
            padding: 1.5,
            borderRadius: "50%",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            width: 44,
            height: 44,
          }}
        >
          <WaterDrop sx={{ color: "white", fontSize: 22 }} />
        </Box>
        <Box>
          <Typography variant="caption" color="gray"></Typography>

          <Typography fontWeight={600} fontSize={14}>
            Economia de Água
          </Typography>
          <Typography fontWeight={700} fontSize={16}>
            {formatNumber(summaryWater)} L
          </Typography>
        </Box>
      </Paper>

      {/* CARD 3 */}
      <Paper
        sx={{
          position: "relative",
          display: "flex",
          alignItems: "center",
          gap: 2,
          padding: "12px 16px",
          borderRadius: 3,
          backgroundColor: "#FAF1E8",
          width: 250,
          marginLeft: 1,
        }}
        elevation={1}
      >
        <Box
          sx={{
            position: "absolute",
            top: 6,
            right: 6,
          }}
        >
          <Tooltip title="Quantidade estimada de emissões de carbono que deixaram de ser lançadas na atmosfera a partir da destinação correta dos resíduos.">
            <IconButton size="small" sx={{ color: "#8A8A8A" }}>
              <InfoOutlinedIcon sx={{ fontSize: 16 }} />
            </IconButton>
          </Tooltip>
        </Box>

        <Box
          sx={{
            backgroundColor: "#2F5D50",
            padding: 1.5,
            borderRadius: "50%",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            width: 44,
            height: 44,
          }}
        >
          <Cloud sx={{ color: "white", fontSize: 22 }} />
        </Box>

        <Box>
          <Typography fontWeight={600} fontSize={14}>
            CO2e Evitado
          </Typography>

          <Typography fontWeight={700} fontSize={16}>
            {formatNumber(summaryCO2)} kg CO2e
          </Typography>
        </Box>
      </Paper>

      <Paper
        sx={{
          position: "relative",
          display: "flex",
          alignItems: "center",
          gap: 2,
          padding: "14px 18px",
          borderRadius: 3,
          backgroundColor: "#FAF1E8",
          width: 250,
          marginLeft: 1,
        }}
        elevation={1}
      >
        <Box
          sx={{
            position: "absolute",
            top: 6,
            right: 6,
          }}
        >
          <Tooltip title="Estimativa monetária do benefício gerado pelo CO2e evitado, com base no custo social do carbono.">
            <IconButton size="small" sx={{ color: "#8A8A8A" }}>
              <InfoOutlinedIcon sx={{ fontSize: 16 }} />
            </IconButton>
          </Tooltip>
        </Box>

        <Box
          sx={{
            backgroundColor: "#2C5F77",
            padding: 1.5,
            borderRadius: "50%",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            width: 44,
            height: 44,
            flexShrink: 0,
          }}
        >
          <Savings sx={{ color: "white", fontSize: 22 }} />
        </Box>

        <Box sx={{ minWidth: 0 }}>
          <Typography variant="caption" color="text.secondary">
            Baseado no CO2e evitado
          </Typography>

          <Typography fontWeight={600} fontSize={13}>
            Valor climático estimado
          </Typography>

          <Typography fontWeight={600} fontSize={14}>
            R$ {formatNumber(summaryCO2Value)}
          </Typography>
        </Box>
      </Paper>
    </>
  );
};

export default memo(BoxesWaterEnergy);
