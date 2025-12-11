import {
  EnergySavingsLeaf,
  WaterDrop,
  OilBarrel,
  Forest,
  Delete,
} from "@mui/icons-material";
import {
  Box,
  Button,
  Divider,
  FormControl,
  IconButton,
  InputLabel,
  MenuItem,
  Paper,
  Select,
  TextField,
  Typography,
} from "@mui/material";
import { CircularProgress } from "@mui/material";
import CloseIcon from "@mui/icons-material/Close";
import { useEffect, useState } from "react";
import {
  Bar,
  BarChart,
  CartesianGrid,
  Cell,
  Line,
  LineChart,
  Pie,
  PieChart,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";
import { styled as styledComponents } from "styled-components";
import { getCollectionByDate } from "../api/collection";
import { getClientsByCNPJs } from "../api/client";
import { getWastes } from "../api/wastes";
import { PDFDownloadLink } from "@react-pdf/renderer";
import DashboardPDF from "./pdf";

const COLORS = ["#4B3838", "#1FA64C", "#8E44AD", "#F1592A"];

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
  const [loading, setLoading] = useState(false);
  const [dataLinhaState, setDataLinhaState] = useState<
    { mes: string; peso: number }[]
  >([]);
  const [selectedPev, setSelectedPev] = useState("");
  const [selectedTipo, setSelectedTipo] = useState("");
  const [optionsPev, setOptionsPev] = useState([]);
  const [optionsResiduos, setOptionsResiduos] = useState([]);
  const [startDate, setStartDate] = useState("");
  const [endDate, setEndDate] = useState("");
  const [energiaData, setEnergiaData] = useState<
    { mes: string; mwh: number }[]
  >([]);
  const [currentMonthEnergy, setCurrentMonthEnergy] = useState(0);
  const [currentMonthAgua, setCurrentMonthAgua] = useState(0);
  const [dataResiduos, setDataResiduos] = useState<
    { name: string; value: number }[]
  >([]);
  const [DataResiduosByPev, setDataResiduosByPev] = useState<
    { name: string; value: number }[]
  >([]);
  const [aguaDataLinha, setAguaDataLinha] = useState<
    { mes: string; litros: number }[]
  >([]);
  const [oilDataLinha, setOilDataLinha] = useState<
    { mes: string; litros: number }[]
  >([]);
  const [treeDataLinha, setTreeDataLinha] = useState<
    { mes: string; value: number }[]
  >([]);
  const [treeData, setTreeData] = useState(0);
  const [savedOilData, setSavedOilData] = useState(0);
  const consumedEnergy: { [key: string]: number } = {
    Plástico: 1.56,
    Papel: 5,
  };
  const consumedWater: { [key: string]: number } = {
    Plástico: 3.03, // Exemplo de consumo de água por kg de plástico
    Papel: 2.6, // Exemplo de consumo de água por kg de papel
  };
  const savedOil: { [key: string]: number } = {
    Plástico: 1.266,
    Papel: 51.7,
    Metal: 3.595,
  };

  const selectedPevObj = (optionsPev as any[]).find(
    (option: any) => option.value === selectedPev
  );
  const selectedPevName = selectedPevObj?.label || "";

  const fetchOptionsPev = async () => {
    try {
      const response = await getClientsByCNPJs([]);
      const clients = response.data.map((client: any) => ({
        label: client.social_name,
        value: client.documentId,
      }));
      setOptionsPev(clients);
    } catch (error) {
      console.error("Erro ao buscar PEVs:", error);
    }
  };

  const fetchOptionsResiduos = async () => {
    // Simulação de opções de resíduos
    try {
      const response = await getWastes();
      if (response && response.data) {
        const residuos = response.data.map((waste: any) => ({
          label: waste.name,
          value: waste.id,
        }));
        setOptionsResiduos(residuos);
      }
    } catch (error) {
      console.error("Erro ao buscar opções de resíduos:", error);
    }
  };

  function applyFiltersToResponse(response: { data: any[] } | null) {
    if (!response || !response.data) {
      return;
    }

    // Filtrar por PEV selecionado
    if (selectedPev) {
      response.data = response.data.filter(
        (item: any) => item.client.documentId === selectedPev
      );
    }

    // Filtrar por tipo de resíduo selecionado
    if (selectedTipo) {
      response.data = response.data.filter(
        (item: any) => item.wastes[0].id === selectedTipo
      );
    }

    return response;
  }

  useEffect(() => {
    const currentDate = new Date();

    let startOfMonth = new Date(
      currentDate.getFullYear(),
      currentDate.getMonth() - 5,
      1
    );
    let endOfMonth = new Date(
      currentDate.getFullYear(),
      currentDate.getMonth() + 1,
      0
    );

    if (startDate) {
      startOfMonth = new Date(startDate);
    }

    if (endDate) {
      endOfMonth = new Date(endDate);
    }

    const fetchData = async () => {
      setLoading(true); // <--- LIGA O LOADING
      try {
        // fetch options for PEV
        fetchOptionsPev();
        fetchOptionsResiduos();

        const resultDataLinha: { mes: string; peso: number }[] = [];
        const energiaData: { mes: string; mwh: number }[] = [];
        const resultAguaDataLinha: { mes: string; litros: number }[] = [];
        const resultOilDataLinha: { mes: string; litros: number }[] = [];
        const resultTreeDataLinha: { mes: string; value: number }[] = [];

        const response = await getCollectionByDate(startOfMonth, endOfMonth);
        applyFiltersToResponse(response);
        if (response) {
          const responseByMonth: { [key: string]: { weight: number }[] } =
            response.data.reduce((acc: any, item: any) => {
              const itemDate = new Date(item.createdAt);
              const month = itemDate.getMonth();
              if (!acc[month]) {
                acc[month] = [];
              }

              acc[month].push(item);
              return acc;
            }, {});
          // Calcular o peso e energia total por mês
          Object.entries(responseByMonth).forEach(([month, items]) => {
            const totalWeight = items.reduce(
              (sum: number, item: any) => sum + (parseFloat(item.weight) || 0),
              0
            );
            const totalMwh = items.reduce((sum: number, item: any) => {
              const energy =
                parseFloat(item.weight) * consumedEnergy[item.wastes[0].name];
              return sum + (energy || 0);
            }, 0);
            const totalLitros = items.reduce((sum: number, item: any) => {
              // Assuming a conversion factor for water savings
              const litros =
                parseFloat(item.weight) * consumedWater[item.wastes[0].name]; // Example conversion
              return sum + (litros || 0);
            }, 0);

            const oilL = items.reduce((sum: number, item: any) => {
              // Assuming a conversion factor for water savings
              const litros =
                parseFloat(item.weight) * savedOil[item.wastes[0].name]; // Example conversion
              return sum + (litros || 0);
            }, 0);

            const totalTree = items.reduce((sum: number, item: any) => {
              // get the month trees saved
              const tree =
                parseFloat(item.weight) *
                (item.wastes[0].name === "Papel" ? 1 / 45 : 0);
              return sum + (tree || 0);
            }, 0);

            resultDataLinha.push({
              mes: new Date(0, parseInt(month)).toLocaleString("default", {
                month: "short",
              }),
              peso: Number(totalWeight.toFixed(2)),
            });
            energiaData.push({
              mes: new Date(0, parseInt(month)).toLocaleString("default", {
                month: "short",
              }),
              mwh: Number(totalMwh.toFixed(2)),
            });
            resultAguaDataLinha.push({
              mes: new Date(0, parseInt(month)).toLocaleString("default", {
                month: "short",
              }),
              litros: Number(totalLitros.toFixed(2)),
            });
            resultOilDataLinha.push({
              mes: new Date(0, parseInt(month)).toLocaleString("default", {
                month: "short",
              }),
              litros: Number(oilL.toFixed(2)),
            });
            resultTreeDataLinha.push({
              mes: new Date(0, parseInt(month)).toLocaleString("default", {
                month: "short",
              }),
              value: Number(totalTree.toFixed(2)),
            });
          });
        }
        setEnergiaData(energiaData);
        setDataLinhaState(resultDataLinha);
        setAguaDataLinha(resultAguaDataLinha);
        setOilDataLinha(resultOilDataLinha);
        setTreeDataLinha(resultTreeDataLinha);
      } catch (err) {
        console.error("Erro ao buscar dados:", err);
      } finally {
        setLoading(false); // <--- DESLIGA O LOADING
      }
    };

    fetchData();
  }, [startDate, endDate, selectedPev, selectedTipo]);

  // current month data fetch
  useEffect(() => {
    const currentDate = new Date();

    let startOfMonth = new Date(
      currentDate.getFullYear(),
      currentDate.getMonth(),
      1
    );
    let endOfMonth = new Date(
      currentDate.getFullYear(),
      currentDate.getMonth() + 1,
      0
    );

    if (startDate) {
      startOfMonth = new Date(startDate);
    }

    if (endDate) {
      endOfMonth = new Date(endDate);
    }

    const fetchCurrentMonthDataByPev = async (pevId?: string) => {
      // se não tiver PEV selecionado, limpa e sai
      if (!pevId) {
        setDataResiduosByPev([]);
        return;
      }
      const response = await getCollectionByDate(startOfMonth, endOfMonth);

      const allData = response?.data || [];

      // Filtra dados somente do PEV
      let filteredData = allData.filter(
        (item: any) => item.client?.documentId === pevId
      );

      // se quiser que o filtro de TIPO também seja aplicado ao PEV:
      // if (selectedTipo) {
      //   filteredData = filteredData.filter(
      //     (item: any) => String(item.wastes?.[0]?.id) === String(selectedTipo)
      //   );
      // }

      console.log("Dados do PEV no período:", filteredData);


      const itemsPercentage: { [key: string]: number } = filteredData?.reduce(
        (acc: any, item: any) => {
          const wasteName = item.wastes?.[0]?.name;
          const weight = parseFloat(item.weight);

          if (!wasteName || isNaN(weight)) return acc;

          acc[wasteName] = (acc[wasteName] || 0) + weight;
          return acc;
        },
        {}
      );

      const totalWeight = Object.values(itemsPercentage).reduce(
        (sum: number, weight: number) => sum + weight,
        0
      );

      const percentageData = Object.entries(itemsPercentage).map(
        ([name, weight]) => ({
          name,
          value: totalWeight
            ? Number(((Number(weight) / totalWeight) * 100).toFixed(2))
            : 0,
        })
      );

      setDataResiduosByPev(percentageData);
    };

    const fetchCurrentMonthData = async () => {
      const response = await getCollectionByDate(startOfMonth, endOfMonth);
      const totalEnergy = response?.data.reduce((sum, item) => {
        // get the month energy consumed
        const energy =
          parseFloat(item.weight) * consumedEnergy[item.wastes[0].name];
        return sum + (energy || 0);
      }, 0);
      const totalTree = response?.data.reduce((sum, item) => {
        // get the month trees saved
        const tree =
          parseFloat(item.weight) *
          (item.wastes[0].name === "Papel" ? 1 / 45 : 0);
        return sum + (tree || 0);
      }, 0);
      const totalWater = response?.data.reduce((sum, item) => {
        // get the month water consumed
        const water =
          parseFloat(item.weight) * consumedWater[item.wastes[0].name];
        return sum + (water || 0);
      }, 0);
      const totalPetroleo = response?.data.reduce((sum, item) => {
        // get the month oil consumed
        const oil = parseFloat(item.weight) * savedOil[item.wastes[0].name];
        return sum + (oil || 0);
      }, 0);
      const itemsPercentage: { [key: string]: number } = response?.data.reduce(
        (acc: any, item: any) => {
          const wasteName = item.wastes[0].name;
          acc[wasteName] = (acc[wasteName] || 0) + parseFloat(item.weight);
          return acc;
        },
        {}
      );
      const totalWeight = Object.values(itemsPercentage)?.reduce(
        (sum: number, weight: number) => sum + weight,
        0
      );
      const percentageData = Object.entries(itemsPercentage).map(
        ([name, weight]) => ({
          name,
          value: Number(((weight / totalWeight) * 100).toFixed(2)),
        })
      );
      setDataResiduos(percentageData);
      setCurrentMonthEnergy(totalEnergy.toFixed(2) || 0);
      setCurrentMonthAgua(totalWater.toFixed(2) || 0);
      setTreeData(totalTree.toFixed(2) || 0);
      setSavedOilData(totalPetroleo.toFixed(2) || 0);
    };
    fetchCurrentMonthData();
    fetchCurrentMonthDataByPev(selectedPev);
  }, [startDate, endDate, selectedPev]);

  function trueDate() {
    const hasPeriod = startDate || endDate;

    if (!selectedPev)
      return hasPeriod ? "No período selecionado — Yby" : "Este Mês — Yby";

    return hasPeriod ? "No período selecionado — PEV" : "Últimos 6 meses — PEV";
  }

  // const totalWeight = dataLinhaState.reduce((sum, item) => sum + item.peso, 0);
  const totalEnergy = energiaData.reduce((sum, item) => sum + item.mwh, 0);
  const totalWater = aguaDataLinha.reduce((sum, item) => sum + item.litros, 0);
  const totalOil = oilDataLinha.reduce((sum, item) => sum + item.litros, 0);
  const totalTree = treeDataLinha?.reduce((sum, item) => sum + item.value, 0);

  const formatNumber = (value: number) => {
    return value.toLocaleString("pt-BR", {
      minimumFractionDigits: 2,
      maximumFractionDigits: 2,
    });
  };

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
                    mode="admin"
                    dataLinhaState={dataLinhaState}
                    energiaData={energiaData}
                    aguaData={aguaDataLinha}
                    oilData={oilDataLinha}
                    treeData={treeDataLinha}
                    dataResiduos={dataResiduos}
                    DataResiduosByPev={DataResiduosByPev}
                    selectedPev={selectedPev}
                    selectedPevName={selectedPevName}
                    selectedTipo={selectedTipo}
                    startDate={startDate}
                    endDate={endDate}
                    currentMonthEnergy={currentMonthEnergy}
                    currentMonthWater={currentMonthAgua}
                    currentMonthOil={savedOilData}
                    currentMonthTree={treeData}
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
                    disabled={loading}
                  >
                    {loading ? "Gerando..." : "BAIXAR DASHBOARD"}
                  </Button>
                )}
              </PDFDownloadLink>
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
                    endAdornment={
                      selectedPev ? (
                        <IconButton
                          size="small"
                          sx={{ marginRight: 2 }}
                          onClick={(e) => {
                            e.stopPropagation();
                            setSelectedPev("");
                          }}
                        >
                          <CloseIcon fontSize="small" />
                        </IconButton>
                      ) : null
                    }
                  >
                    {optionsPev.map((option: any) => (
                      <MenuItem key={option.value} value={option.value}>
                        {option.label}
                      </MenuItem>
                    ))}
                  </Select>
                </FormControl>

                <FormControl sx={{ width: 230 }}>
                  <InputLabel id="tipo-label">Tipo de resíduo</InputLabel>
                  <Select
                    labelId="tipo-label"
                    value={selectedTipo}
                    onChange={(e) => setSelectedTipo(e.target.value)}
                    label="Tipo de resíduo"
                    endAdornment={
                      selectedTipo ? (
                        <IconButton
                          size="small"
                          sx={{ marginRight: 2 }}
                          onClick={(e) => {
                            e.stopPropagation();
                            setSelectedTipo("");
                          }}
                        >
                          <CloseIcon fontSize="small" />
                        </IconButton>
                      ) : null
                    }
                  >
                    {optionsResiduos.map((option: any) => (
                      <MenuItem key={option.value} value={option.value}>
                        {option.label}
                      </MenuItem>
                    ))}
                  </Select>
                </FormControl>

                <TextField
                  type="date"
                  label="Data inicial"
                  value={startDate}
                  onChange={(e) => setStartDate(e.target.value)}
                  size="small"
                  InputLabelProps={{ shrink: true }}
                />
                <TextField
                  type="date"
                  label="Data final"
                  value={endDate}
                  onChange={(e) => setEndDate(e.target.value)}
                  size="small"
                  InputLabelProps={{ shrink: true }}
                />
              </Box>
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
                  <Typography variant="caption" color="gray">
                    {trueDate()}
                  </Typography>

                  {!selectedPev ? (
                    <>
                      <Typography fontWeight={600} fontSize={14}>
                        Consumo de Energia {currentMonthEnergy} MWh
                      </Typography>
                    </>
                  ) : (
                    <>
                      <Typography fontWeight={600} fontSize={14}>
                        Consumo de Energia {formatNumber(totalEnergy)} MWh
                      </Typography>
                    </>
                  )}
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
                  <Typography variant="caption" color="gray">
                    {trueDate()}
                  </Typography>
                  {!selectedPev ? (
                    <>
                      <Typography fontWeight={600} fontSize={14}>
                        Economia de Água {currentMonthAgua}L
                      </Typography>
                    </>
                  ) : (
                    <>
                      <Typography fontWeight={600} fontSize={14}>
                        Economia de Água {formatNumber(totalWater)}L
                      </Typography>
                    </>
                  )}
                </Box>
              </Paper>
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
                  Coleta em peso (kg) por mês
                </Typography>
                <ResponsiveContainer width="100%" height={200}>
                  <LineChart data={dataLinhaState}>
                    <CartesianGrid strokeDasharray="4 4" vertical={false} />
                    <XAxis dataKey="mes" />
                    <YAxis
                      // domain={[10, 12]}
                      tickFormatter={(value) => `${value}kg`}
                    />
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
              <Box
                sx={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 2 }}
              >
                <Paper
                  elevation={1}
                  sx={{
                    backgroundColor: "#FAF1E8",
                    padding: 3,
                    borderRadius: 3,
                    minHeight: 300,
                  }}
                >
                  {!selectedPev ? (
                    <>
                      {startDate || endDate ? (
                        <>
                          <Typography
                            variant="subtitle1"
                            sx={{ fontWeight: 500, color: "#4B3838", mb: 2 }}
                          >
                            Tipo de resíduo coletado no período — Yby
                          </Typography>
                        </>
                      ) : (
                        <>
                          <Typography
                            variant="subtitle1"
                            sx={{ fontWeight: 500, color: "#4B3838", mb: 2 }}
                          >
                            Tipo de resíduo coletado no mês — Yby
                          </Typography>
                        </>
                      )}

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
                      {/* Legend for PieChart */}
                      <Box
                        sx={{
                          display: "flex",
                          flexDirection: "column",
                          mt: 2,
                          gap: 1,
                        }}
                      >
                        {dataResiduos.map((entry, index) => (
                          <Box
                            key={entry.name}
                            sx={{ display: "flex", alignItems: "center" }}
                          >
                            <Box
                              sx={{
                                width: 16,
                                height: 16,
                                backgroundColor: COLORS[index % COLORS.length],
                                borderRadius: "50%",
                                mr: 1,
                              }}
                            />
                            <Typography
                              variant="body2"
                              sx={{ color: "#4B3838" }}
                            >
                              <b>{entry.name}</b> {entry.value}%
                            </Typography>
                          </Box>
                        ))}
                      </Box>
                    </>
                  ) : (
                    <>
                      <Typography
                        variant="subtitle1"
                        sx={{ fontWeight: 500, color: "#4B3838", mb: 2 }}
                      >
                        Tipo de resíduo coletado no período — PEV
                      </Typography>
                      <ResponsiveContainer width="100%" height={200}>
                        <PieChart>
                          <Pie
                            data={DataResiduosByPev}
                            cx="50%"
                            cy="50%"
                            labelLine={false}
                            outerRadius={90}
                            innerRadius={30}
                            paddingAngle={3}
                            dataKey="value"
                          >
                            {DataResiduosByPev.map((entry, index) => (
                              <Cell
                                key={`cell-${index}`}
                                fill={COLORS[index % COLORS.length]}
                              />
                            ))}
                          </Pie>
                        </PieChart>
                      </ResponsiveContainer>
                      {/* Legend for PieChart */}
                      <Box
                        sx={{
                          display: "flex",
                          flexDirection: "column",
                          mt: 2,
                          gap: 1,
                        }}
                      >
                        {DataResiduosByPev.map((entry, index) => (
                          <Box
                            key={entry.name}
                            sx={{ display: "flex", alignItems: "center" }}
                          >
                            <Box
                              sx={{
                                width: 16,
                                height: 16,
                                backgroundColor: COLORS[index % COLORS.length],
                                borderRadius: "50%",
                                mr: 1,
                              }}
                            />
                            <Typography
                              variant="body2"
                              sx={{ color: "#4B3838" }}
                            >
                              <b>{entry.name}</b> {entry.value}%
                            </Typography>
                          </Box>
                        ))}
                      </Box>
                    </>
                  )}
                </Paper>
                {!selectedPev ? (
                  <>
                    <Box display="flex" flexDirection="column" gap={2}>
                      {[
                        {
                          icon: <OilBarrel sx={{ color: "white" }} />,
                          bg: "#005C87",
                          label: "PETRÓLEO",
                          value: savedOilData + "L",
                        },
                        {
                          icon: <Forest sx={{ color: "white" }} />,
                          bg: "#1FA64C",
                          label: "ÁRVORES POUPADAS",
                          value: treeData + " Árvores",
                        },
                        {
                          icon: <Delete sx={{ color: "white" }} />,
                          bg: "#4B3838",
                          label: "ESPAÇO EM ATERRO SANITÁRIO (m²)",
                          value: 3000 + "M²",
                        },
                      ].map((item, i) => (
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
                            <Typography fontWeight={600}>
                              {item.value}
                            </Typography>
                          </Box>
                        </Paper>
                      ))}
                    </Box>
                  </>
                ) : (
                  <>
                    <Box display="flex" flexDirection="column" gap={2}>
                      {[
                        {
                          icon: <OilBarrel sx={{ color: "white" }} />,
                          bg: "#005C87",
                          label: "PETRÓLEO",
                          value: formatNumber(totalOil) + "L",
                        },
                        {
                          icon: <Forest sx={{ color: "white" }} />,
                          bg: "#1FA64C",
                          label: "ÁRVORES POUPADAS",
                          value: formatNumber(totalTree) + " Árvores",
                        },
                        {
                          icon: <Delete sx={{ color: "white" }} />,
                          bg: "#4B3838",
                          label: "ESPAÇO EM ATERRO SANITÁRIO (m²)",
                          value: 3000 + "M²",
                        },
                      ].map((item, i) => (
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
                            <Typography fontWeight={600}>
                              {item.value}
                            </Typography>
                          </Box>
                        </Paper>
                      ))}
                    </Box>
                  </>
                )}
              </Box>
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
                  Economia de Água (L) por mês
                </Typography>
                <ResponsiveContainer width="100%" height={200}>
                  <LineChart data={aguaDataLinha}>
                    <CartesianGrid strokeDasharray="4 4" vertical={false} />
                    <XAxis dataKey="mes" />
                    <YAxis tickFormatter={(value) => `${value}L`} />
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
                <Typography
                  variant="subtitle1"
                  sx={{ fontWeight: 500, color: "#4B3838", mb: 2 }}
                >
                  Consumo de Energia (MWh) por mês
                </Typography>
                <ResponsiveContainer width="100%" height={200}>
                  <BarChart data={energiaData}>
                    <CartesianGrid strokeDasharray="4 4" vertical={false} />
                    <XAxis dataKey="mes" />
                    <YAxis tickFormatter={(value) => `${value}`} />
                    <Tooltip formatter={(value: number) => `${value} MWh`} />
                    <Bar
                      dataKey="mwh"
                      fill="#F1592A"
                      radius={[10, 10, 0, 0]}
                      barSize={10}
                    />
                  </BarChart>
                </ResponsiveContainer>
              </Paper>
            </Box>
          </>
        )}
      </StyledCenterContainer>
    </StyledContainer>
  );
}
