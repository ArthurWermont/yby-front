import { EnergySavingsLeaf, WaterDrop } from "@mui/icons-material";
import { Box, Paper, Typography } from "@mui/material";
import { FC, memo, useEffect, useState } from "react";
import {
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

    fetchSummaryWater();
    fetchSummaryEnergy();
  }, [pevId, startDate, endDate, wasteId]);

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
            Consumo de Energia {summaryEnergy.toFixed(2)} MWh
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
            Economia de Água {summaryWater.toFixed(2)}L
          </Typography>
        </Box>
      </Paper>
    </>
  );
};

export default memo(BoxesWaterEnergy);
