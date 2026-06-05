import { Paper, Typography, Box } from "@mui/material";
import { type FC, memo, useEffect, useState } from "react";
import { ResponsiveContainer, PieChart, Pie, Cell } from "recharts";
import { useDashboardContext } from "./context";
import { getWasteDistribution } from "../api/dashboard";

const ByWaste: FC = (props) => {
  const {
    startDate,
    endDate,
    selectedPevs,
    waste: wasteId,
    setReport,
  } = useDashboardContext();
  const [dataResiduos, setDataResiduos] = useState<
    { name: string; value: number }[]
  >([]);

  const pevKey = selectedPevs.join("|");
  const COLORS = [
    "#4B3838",
    "#1FA64C",
    "#8E44AD",
    "#F1592A",
    "#F1C40F",
    "#3498DB",
    "#7F8C8D",
  ];

  useEffect(() => {
    const fetchWasteData = async () => {
      try {
        const response = await getWasteDistribution({
          start: startDate,
          end: endDate,
          pevId: selectedPevs,
          wasteId,
        });
        setDataResiduos(response.data);
        setReport({ dataResiduos: response.data });
      } catch (error) {
        console.error("Erro ao buscar resíduos:", error);
        setDataResiduos([]);
      }
    };
    fetchWasteData();
  }, [startDate, endDate, pevKey, wasteId]);

  const wasteTitle = pevKey
    ? "Tipo de resíduo coletado no período — PEV"
    : "Tipo de resíduo coletado no período — Yby";

  return (
    <Paper
      elevation={1}
      sx={{
        backgroundColor: "#FAF1E8",
        padding: 3,
        borderRadius: 3,
        minHeight: 300,
      }}
    >
      <Typography
        variant="subtitle1"
        sx={{ fontWeight: 500, color: "#4B3838", mb: 2 }}
      >
        {wasteTitle}
      </Typography>

      <ResponsiveContainer width="100%" height={200}>
        <PieChart>
          <Pie
            data={dataResiduos}
            cx="50%"
            cy="50%"
            labelLine={false}
            outerRadius={90}
            innerRadius={30}
            paddingAngle={3}
            dataKey="value"
          >
            {dataResiduos.map((entry, index) => (
              <Cell
                key={`cell-${index}`}
                fill={COLORS[index % COLORS.length]}
              />
            ))}
          </Pie>
        </PieChart>
      </ResponsiveContainer>

      {/* Legend */}
      <Box
        sx={{
          display: "flex",
          flexDirection: "column",
          mt: 2,
          gap: 1,
        }}
      >
        {dataResiduos.map((entry, index) => (
          <Box key={entry.name} sx={{ display: "flex", alignItems: "center" }}>
            <Box
              sx={{
                width: 16,
                height: 16,
                backgroundColor: COLORS[index % COLORS.length],
                borderRadius: "50%",
                mr: 1,
              }}
            />
            <Typography variant="body2" sx={{ color: "#4B3838" }}>
              <b>{entry.name}</b> {entry.value}%
            </Typography>
          </Box>
        ))}
      </Box>
    </Paper>
  );
};

export default memo(ByWaste);
