import React, { useState } from "react";
import {
  Box,
  Button,
  Divider,
  FormControl,
  InputLabel,
  MenuItem,
  Paper,
  Select,
  TextField,
  Typography
} from "@mui/material";
import { styled as styledComponents } from "styled-components";
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  BarChart,
  Bar,
  Cell,
  Pie,
  PieChart
} from "recharts";
import OilBarrelIcon from "@mui/icons-material/OilBarrel";
import ForestIcon from "@mui/icons-material/Forest";
import DeleteIcon from "@mui/icons-material/Delete";
import GroupIcon from "@mui/icons-material/Group"; // para pessoas impactadas (mais sugestivo que repetir ícone de petróleo)
import { SolarPower, WaterDrop } from "@mui/icons-material";
import { EnergySavingsLeaf } from "@mui/icons-material";




// Dados do gráfico
const datalinha = [
  { mes: "Jan", peso: 20 },
  { mes: "Fev", peso: 42 },
  { mes: "Mar", peso: 31 },
  { mes: "Abr", peso: 65 },
  { mes: "Mai", peso: 40 },
  { mes: "Jun", peso: 55 },
];

const energiaData = [
  { mes: "Jan", kwh: 3200 },
  { mes: "Fev", kwh: 4600 },
  { mes: "Mar", kwh: 3500 },
  { mes: "Abr", kwh: 4900 },
  { mes: "Mai", kwh: 2100 },
  { mes: "Jun", kwh: 4300 },
];

const dataResiduos = [
  { name: "Plástico", value: 30 },
  { name: "Papel", value: 15 },
  { name: "Vidro", value: 20 },
  { name: "Metal", value: 35 },
];

const aguaData = [
  { mes: "Jan", litros: 120 },
  { mes: "Fev", litros: 380 },
  { mes: "Mar", litros: 290 },
  { mes: "Abr", litros: 410 },
  { mes: "Mai", litros: 320 },
  { mes: "Jun", litros: 330 },
];

const COLORS = ["#4B3838", "#1FA64C", "#8E44AD", "#F1592A"];

const renderCustomizedLabel = ({
  cx,
  cy,
  midAngle,
  innerRadius,
  outerRadius,
  percent,
  index,
}: any) => {
  const RADIAN = Math.PI / 180;
  const radius = innerRadius + (outerRadius - innerRadius) * 0.5;
  const x = cx + radius * Math.cos(-midAngle * RADIAN);
  const y = cy + radius * Math.sin(-midAngle * RADIAN);

  return (
    <text
      x={x}
      y={y}
      fill="#fff"
      textAnchor="middle"
      dominantBaseline="central"
      fontSize={12}
    >
      {`${dataResiduos[index].value}%\n${dataResiduos[index].name}`}
    </text>
  );
};

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

export default function Dashboard() {
  const [selectedPev, setSelectedPev] = useState('');
  const [selectedTipo, setSelectedTipo] = useState('');
  const [selectedPeriodo, setSelectedPeriodo] = useState('');
  const [research, setResearch] = useState('');

  return (
    <StyledContainer>
      <StyledCenterContainer>
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
          <Typography
            style={{ fontSize: "32px", fontWeight: "600", color: "#4B3838" }}
          >
            Dashboard
          </Typography>
          <Button
            variant="contained"
            sx={{
              backgroundColor: "#2E7D32",
              textTransform: "none",
              fontWeight: 500,
            }}
          >
            BAIXAR DASHBOARD
          </Button>
        </div>

        <Divider style={{ marginTop: 8, marginBottom: 24 }} />

        <Box
          display="flex"
          justifyContent="space-between"
          alignItems="flex-start"
          marginTop={3}
          marginBottom={3}
          flexWrap="wrap"
        >
          <Box display="flex" gap={2} flexWrap="wrap">
            <FormControl sx={{ width: 230 }}>
              <InputLabel id="pev-label">Selecionar PEV</InputLabel>
              <Select
                labelId="pev-label"
                value={selectedPev}
                onChange={(e) => setSelectedPev(e.target.value)}
                label="Selecionar PEV"
              >
                <MenuItem value="plastico">Plástico</MenuItem>
                <MenuItem value="vidro">Vidro</MenuItem>
                <MenuItem value="papel">Papel</MenuItem>
                <MenuItem value="metal">Metal</MenuItem>
              </Select>
            </FormControl>

            <FormControl sx={{ width: 230 }}>
              <InputLabel id="tipo-label">Tipo de resíduo</InputLabel>
              <Select
                labelId="tipo-label"
                value={selectedTipo}
                onChange={(e) => setSelectedTipo(e.target.value)}
                label="Tipo de resíduo"
              >
                <MenuItem value="plastico">Plástico</MenuItem>
                <MenuItem value="vidro">Vidro</MenuItem>
                <MenuItem value="papel">Papel</MenuItem>
                <MenuItem value="metal">Metal</MenuItem>
              </Select>
            </FormControl>

            <FormControl sx={{ width: 230 }}>
              <InputLabel id="periodo-label">Selecionar período</InputLabel>
              <Select
                labelId="periodo-label"
                value={selectedPeriodo}
                onChange={(e) => setSelectedPeriodo(e.target.value)}
                label="Selecionar período"
              >
                <MenuItem value="jan-mar">Jan - Mar</MenuItem>
                <MenuItem value="abr-jun">Abr - Jun</MenuItem>
              </Select>
            </FormControl>
          </Box>

          <TextField
            placeholder="Pesquisar"
            value={research}
            onChange={(e) => setResearch(e.target.value)}
            sx={{ width: 300 }}
          />
        </Box>
        <Box
          sx={{
            display: "flex",
            gap: 2,
            justifyContent: "flex-start",
            flexWrap: "wrap",
            marginTop: 2,
          }}
        >
          {/* CARD 1 */}
          <Paper
            sx={{
              display: "flex",
              alignItems: "center",
              gap: 2,
              padding: "12px 16px",
              borderRadius: 3,
              backgroundColor: "#FAF1E8",
              // minWidth: 260,
              // maxWidth: 280,
              width: 250
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
              <Typography variant="caption" color="gray">
                Este mês
              </Typography>
              <Typography fontWeight={600} fontSize={14}>
                Economia de Energia 15.200 kWh
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
              // minWidth: 260,
              // maxWidth: 280,
              width: 250,
              marginLeft: 1
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
              <Typography variant="caption" color="gray">
                Este mês
              </Typography>
              <Typography fontWeight={600} fontSize={14}>
                Economia de Água 22.050L
              </Typography>
            </Box>
          </Paper>

          {/* CARD 3 */}
          <Paper
            sx={{
              display: "flex",
              alignItems: "center",
              gap: 2,
              padding: "12px 16px",
              borderRadius: 3,
              backgroundColor: "#FAF1E8",
              // minWidth: 260,
              // maxWidth: 280,
              width: 250,
              marginLeft: 1
            }}
            elevation={1}
          >
            <Box
              sx={{
                backgroundColor: "purple",
                padding: 1.5,
                borderRadius: "50%",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                width: 44,
                height: 44,
              }}
            >
              <SolarPower sx={{ color: "white", fontSize: 22 }} />
            </Box>
            <Box>
              <Typography variant="caption" color="gray">
                Este mês
              </Typography>
              <Typography fontWeight={600} fontSize={14}>
                Pessoas impactadas
              </Typography>
              <Typography fontWeight={600} fontSize={14}>
                +50
              </Typography>
            </Box>
          </Paper>

          {/* CARD 4 */}
          <Paper
            sx={{
              display: "flex",
              alignItems: "center",
              gap: 2,
              padding: "12px 16px",
              borderRadius: 3,
              backgroundColor: "#FAF1E8",
              // minWidth: 260,
              // maxWidth: 280,
              width: 250,
              marginLeft: 1
            }}
            elevation={1}
          >
            <Box
              sx={{
                backgroundColor: "#4B3838",
                padding: 1.5,
                borderRadius: "50%",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                width: 44,
                height: 44,
              }}
            >
              <GroupIcon sx={{ color: "white", fontSize: 22 }} />
            </Box>
            <Box>
              <Typography variant="caption" color="gray">
                Este mês
              </Typography>
              <Typography fontWeight={600} fontSize={14}>
                Pessoas impactadas
              </Typography>
              <Typography fontWeight={600} fontSize={14}>
                +50
              </Typography>
            </Box>
          </Paper>
        </Box>

        <Box
          sx={{
            display: "grid",
            gridTemplateColumns: "1fr 1fr",
            gap: 3,
            marginTop: 4,
            marginBottom: 4
          }}
        >
          {/* Coleta em peso (linha) */}
          <Paper
            elevation={1}
            sx={{
              backgroundColor: "#FAF1E8",
              padding: 3,
              borderRadius: 3,
              minHeight: 300,
            }}
          >
            <Typography variant="subtitle1" sx={{ fontWeight: 500, color: "#4B3838", mb: 2 }}>
              Coleta em peso (kg) por mês
            </Typography>
            <ResponsiveContainer width="100%" height={200}>
              <LineChart data={datalinha}>
                <CartesianGrid strokeDasharray="4 4" vertical={false} />
                <XAxis dataKey="mes" />
                <YAxis domain={[10, 75]} tickFormatter={(value) => `${value}kg`} />
                <Tooltip formatter={(value: number) => `${value} kg`} />
                <Line
                  type="linear"
                  dataKey="peso"
                  stroke="#4B3838"
                  strokeWidth={2}
                  dot={{ fill: "white", strokeWidth: 2, r: 4 }}
                />
              </LineChart>
            </ResponsiveContainer>
          </Paper>

          {/* Gráfico de Pizza + Economia */}
          <Box sx={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 2 }}>
            <Paper
              elevation={1}
              sx={{
                backgroundColor: "#FAF1E8",
                padding: 3,
                borderRadius: 3,
                minHeight: 300,
              }}
            >
              <Typography variant="subtitle1" sx={{ fontWeight: 500, color: "#4B3838", mb: 2 }}>
                Tipo de resíduo coletado no mês
              </Typography>
              <ResponsiveContainer width="100%" height={200}>
                <PieChart>
                  <Pie
                    data={dataResiduos}
                    cx="50%"
                    cy="50%"
                    labelLine={false}
                    label={renderCustomizedLabel}
                    outerRadius={90}
                    innerRadius={30}
                    paddingAngle={3}
                    dataKey="value"
                  >
                    {dataResiduos.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                    ))}
                  </Pie>
                </PieChart>
              </ResponsiveContainer>
            </Paper>

            {/* Cards Economia+ */}
            <Box display="flex" flexDirection="column" gap={2}>
              {[{
                icon: <OilBarrelIcon sx={{ color: "white" }} />,
                bg: "#005C87",
                label: "PETRÓLEO",
                value: 1200 + "L"
              }, {
                icon: <ForestIcon sx={{ color: "white" }} />,
                bg: "#1FA64C",
                label: "ÁRVORES POUPADAS",
                value: 122
              }, {
                icon: <DeleteIcon sx={{ color: "white" }} />,
                bg: "#4B3838",
                label: "ESPAÇO EM ATERRO SANITÁRIO (m²)",
                value: 3000 + "M²"
              }].map((item, i) => (
                <Paper
                  key={i}
                  sx={{
                    display: "flex",
                    alignItems: "center",
                    gap: 2,
                    padding: 2,
                    borderRadius: 3,
                    backgroundColor: "#FAF1E8",
                  }}
                  elevation={1}
                >
                  <Box
                    sx={{
                      backgroundColor: item.bg,
                      padding: 1.5,
                      borderRadius: "50%",
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "center",
                    }}
                  >
                    {item.icon}
                  </Box>
                  <Box>
                    <Typography variant="caption" color="gray">
                      {item.label}
                    </Typography>
                    <Typography fontWeight={600}>{item.value}</Typography>
                  </Box>
                </Paper>
              ))}
            </Box>
          </Box>

          {/* Economia de Água */}
          <Paper
            elevation={1}
            sx={{
              backgroundColor: "#FAF1E8",
              padding: 3,
              borderRadius: 3,
              minHeight: 300,
            }}
          >
            <Typography variant="subtitle1" sx={{ fontWeight: 500, color: "#4B3838", mb: 2 }}>
              Economia de Água (L) por mês
            </Typography>
            <ResponsiveContainer width="100%" height={200}>
              <LineChart data={aguaData}>
                <CartesianGrid strokeDasharray="4 4" vertical={false} />
                <XAxis dataKey="mes" />
                <YAxis domain={[100, 500]} tickFormatter={(value) => `${value}L`} />
                <Tooltip formatter={(value: number) => `${value} L`} />
                <Line
                  type="linear"
                  dataKey="litros"
                  stroke="#0070C0"
                  strokeWidth={2}
                  dot={{ fill: "white", strokeWidth: 2, r: 4 }}
                />
              </LineChart>
            </ResponsiveContainer>
          </Paper>

          {/* Economia de Energia */}
          <Paper
            elevation={1}
            sx={{
              backgroundColor: "#FAF1E8",
              padding: 3,
              borderRadius: 3,
              minHeight: 300,
            }}
          >
            <Typography variant="subtitle1" sx={{ fontWeight: 500, color: "#4B3838", mb: 2 }}>
              Economia de Energia (kWh) por mês
            </Typography>
            <ResponsiveContainer width="100%" height={200}>
              <BarChart data={energiaData}>
                <CartesianGrid strokeDasharray="4 4" vertical={false} />
                <XAxis dataKey="mes" />
                <YAxis tickFormatter={(value) => `${value}`} />
                <Tooltip formatter={(value: number) => `${value} kWh`} />
                <Bar
                  dataKey="kwh"
                  fill="#F1592A"
                  radius={[10, 10, 0, 0]}
                  barSize={10}
                />
              </BarChart>
            </ResponsiveContainer>
          </Paper>
        </Box>
      </StyledCenterContainer>
    </StyledContainer>
  );
}
