import {
  EnergySavingsLeaf, WaterDrop, OilBarrel, Forest, Delete,
} from "@mui/icons-material";
import {
  Box, Button, Divider, FormControl, IconButton, InputLabel,
  MenuItem, Paper, Select, TextField, Typography, CircularProgress
} from "@mui/material";
import CloseIcon from "@mui/icons-material/Close";
import React, { useContext, useEffect, useState } from "react";
import {
  Bar, BarChart, CartesianGrid, Cell, Line, LineChart, Pie, PieChart,
  ResponsiveContainer, Tooltip, XAxis, YAxis
} from "recharts";
import { styled as styledComponents } from "styled-components";
import { getCollectionByDateForClient } from "../api/collection"; // <-- NOVO (server-side filter)
import { getWastes } from "../api/wastes";
import { PDFDownloadLink } from "@react-pdf/renderer";
import DashboardPDF from "./pdf";
import { AuthContext } from "../context/auth-context"; // <-- usamos para ler client_id

const COLORS = ["#4B3838", "#1FA64C", "#8E44AD", "#F1592A"];

// estilos iguais ao original
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

export default function DashClient() {
  const [loading, setLoading] = useState(false);

  // --- estados iguais ao original ---
  const [dataLinhaState, setDataLinhaState] = useState<{ mes: string; peso: number }[]>([]);
  const [selectedTipo, setSelectedTipo] = useState<string>("");
  const [optionsResiduos, setOptionsResiduos] = useState<any[]>([]);
  const [startDate, setStartDate] = useState<string>("");
  const [endDate, setEndDate] = useState<string>("");
  const [energiaData, setEnergiaData] = useState<{ mes: string; mwh: number }[]>([]);
  const [currentMonthEnergy, setCurrentMonthEnergy] = useState<number>(0);
  const [currentMonthAgua, setCurrentMonthAgua] = useState<number>(0);
  const [dataResiduos, setDataResiduos] = useState<{ name: string; value: number }[]>([]);
  const [aguaDataLinha, setAguaDataLinha] = useState<{ mes: string; litros: number }[]>([]);
  const [oilDataLinha, setOilDataLinha] = useState<{ mes: string; litros: number }[]>([]);
  const [treeData, setTreeData] = useState<number>(0);
  const [savedOilData, setSavedOilData] = useState<number>(0);
  

  // --- fatores (iguais) ---
  const consumedEnergy: Record<string, number> = { Plástico: 1.56, Papel: 5 };
  const consumedWater:  Record<string, number> = { Plástico: 3.03, Papel: 2.6 };
  const savedOil:       Record<string, number> = { Plástico: 1.266, Papel: 51.7, Metal: 3.595 };

  // >>> MUDANÇA PRINCIPAL: ler o client_id do usuário logado
  const { user } = useContext(AuthContext);
  const clientDocId: string | undefined =
    (user as any)?.client_id || (user as any)?.client?.documentId;

  // carregar opções de resíduos (igual ao original)
  useEffect(() => {
    (async () => {
      try {
        const resp = await getWastes();
        const opts = (resp?.data || []).map((w: any) => ({ label: w.name, value: String(w.id) }));
        setOptionsResiduos(opts);
      } catch (e) {
        console.error("Erro ao buscar resíduos", e);
      }
    })();
  }, []);

  // --------- FETCH PRINCIPAL (agregado por mês) ----------
  useEffect(() => {
    if (!clientDocId) return; // sem cliente, não carrega nada

    const now = new Date();
    const start = startDate ? new Date(startDate) : new Date(now.getFullYear(), now.getMonth() - 5, 1);
    const end   = endDate   ? new Date(endDate)   : new Date(now.getFullYear(), now.getMonth() + 1, 0);

    (async () => {
      setLoading(true);
      try {
        // >>> MUDANÇA: chamamos já filtrando pelo cliente no servidor
        const resp = await getCollectionByDateForClient(clientDocId!, start, end);
        let rows: any[] = resp?.data ?? [];

        // filtro opcional por tipo de resíduo
        if (selectedTipo) {
          rows = rows.filter(r => String(r?.wastes?.[0]?.id) === String(selectedTipo));
        }

        // agrupar por mês da data usada nos gráficos (createdAt já vem ajustado pelo formatCollectionData)
        const byMonth = rows.reduce<Record<number, any[]>>((acc, it) => {
          const m = new Date(it.createdAt).getMonth();
          (acc[m] ||= []).push(it);
          return acc;
        }, {});

        const linha:   { mes: string; peso: number }[] = [];
        const energia: { mes: string; mwh: number }[] = [];
        const agua:    { mes: string; litros: number }[] = [];
        const oil:    { mes: string; litros: number }[] = [];

        Object.entries(byMonth).forEach(([m, items]) => {
          const peso   = items.reduce<number>((s, it) => s + (parseFloat(it?.weight) || 0), 0);
          const mwh    = items.reduce<number>((s, it) => s + (parseFloat(it?.weight) * (consumedEnergy[it?.wastes?.[0]?.name] || 0)), 0);
          const litros = items.reduce<number>((s, it) => s + (parseFloat(it?.weight) * (consumedWater[it?.wastes?.[0]?.name]  || 0)), 0);
          const oilL = items.reduce<number>((s, it) => s + (parseFloat(it?.weight) * (savedOil[it?.wastes?.[0]?.name]  || 0)), 0);

          const label = new Date(0, Number(m)).toLocaleString("default", { month: "short" });
          linha.push({  mes: label,  peso:   Number(peso.toFixed(2)) });
          energia.push({mes: label,  mwh:    Number(mwh.toFixed(2)) });
          agua.push({   mes: label,  litros: Number(litros.toFixed(2)) });
          oil.push({   mes: label,  litros: Number(oilL.toFixed(2)) });
        });

        setDataLinhaState(linha);
        setEnergiaData(energia);
        setAguaDataLinha(agua);
        setOilDataLinha(oil);

        // ---- KPIs do período selecionado (mês corrente por padrão) ----
        const monthRows = rows.filter(r => {
          const d = new Date(r.createdAt);
          return d >= start && d <= end;
        });

        const totalEnergy = monthRows.reduce<number>((s, it) => s + (parseFloat(it.weight) * (consumedEnergy[it?.wastes?.[0]?.name] || 0)), 0);
        const totalWater  = monthRows.reduce<number>((s, it) => s + (parseFloat(it.weight) * (consumedWater[it?.wastes?.[0]?.name]  || 0)), 0);
        const totalOil    = monthRows.reduce<number>((s, it) => s + (parseFloat(it.weight) * (savedOil[it?.wastes?.[0]?.name]     || 0)), 0);
        const totalTrees  = monthRows.reduce<number>((s, it) => s + ((it?.wastes?.[0]?.name === "Papel") ? (parseFloat(it.weight) / 45) : 0), 0);

        setCurrentMonthEnergy(Number(totalEnergy.toFixed(2)));
        setCurrentMonthAgua(Number(totalWater.toFixed(2)));
        setSavedOilData(Number(totalOil.toFixed(2)));
        setTreeData(Number(totalTrees.toFixed(2)));

        // ---- % por tipo (tipado para não dar erro no `total`) ----
        const weightsBy = monthRows.reduce<Record<string, number>>((acc, it) => {
          const name = it?.wastes?.[0]?.name as string | undefined;
          const w = parseFloat(it?.weight ?? 0);
          if (name) acc[name] = (acc[name] ?? 0) + (isNaN(w) ? 0 : w);
          return acc;
        }, {});
        const total: number = Object.values(weightsBy).reduce<number>((sum, v) => sum + v, 0);
        const perc = Object.entries(weightsBy).map(([name, w]) => ({
          name,
          value: total > 0 ? Number(((w / total) * 100).toFixed(2)) : 0,
        }));
        setDataResiduos(perc);
      } catch (e) {
        console.error("Erro ao carregar dashboard do cliente", e);
      } finally {
        setLoading(false);
      }
    })();
  }, [clientDocId, startDate, endDate, selectedTipo]);

  function trueDate(){
    if(startDate || endDate){
      return `No período selecionado`
    }
    return "Últimos 6 meses";
  }
  

  return (
    <StyledContainer>
      <StyledCenterContainer>
        {loading ? (
          <Box display="flex" flexDirection="column" justifyContent="center" alignItems="center" minHeight="300px" gap={2}>
            <CircularProgress size={48} thickness={4} color="success" />
            <Typography variant="body1" color="textSecondary">Carregando dados do Dashboard...</Typography>
          </Box>
        ) : (
          <>
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
              <Typography style={{ fontSize: 32, fontWeight: 600, color: "#4B3838" }}>Dashboard</Typography>
              <PDFDownloadLink
                document={
                  <DashboardPDF
                    mode="client"
                    dataLinhaState={dataLinhaState}
                    energiaData={energiaData}
                    aguaData={aguaDataLinha}
                    oilData={oilDataLinha}
                    dataResiduos={dataResiduos}
                    clientName={user?.username}
                    selectedPev={null}                // <<< não existe PEV para cliente
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
                  <Button variant="contained" sx={{ backgroundColor: "#2E7D32", textTransform: "none", fontWeight: 500 }} disabled={loading}>
                    {loading ? "Gerando..." : "BAIXAR DASHBOARD"}
                  </Button>
                )}
              </PDFDownloadLink>
            </div>

            <Divider sx={{ mt: 1, mb: 3 }} />

            {/* Filtros: só tipo e data (sem PEV) */}
            <Box display="flex" justifyContent="space-between" alignItems="flex-start" mt={3} mb={3} flexWrap="wrap">
              <Box display="flex" gap={2} flexWrap="wrap">
                <FormControl sx={{ width: 230 }}>
                  <InputLabel id="tipo-label">Tipo de resíduo</InputLabel>
                  <Select
                    labelId="tipo-label"
                    value={selectedTipo}
                    onChange={(e) => setSelectedTipo(String(e.target.value))}
                    label="Tipo de resíduo"
                    endAdornment={
                      selectedTipo ? (
                        <IconButton size="small" sx={{ mr: 2 }} onClick={(e) => { e.stopPropagation(); setSelectedTipo(""); }}>
                          <CloseIcon fontSize="small" />
                        </IconButton>
                      ) : null
                    }
                  >
                    {optionsResiduos.map((op) => (
                      <MenuItem key={op.value} value={op.value}>{op.label}</MenuItem>
                    ))}
                  </Select>
                </FormControl>

                <TextField type="date" label="Data inicial" value={startDate} onChange={(e) => setStartDate(e.target.value)} size="small" InputLabelProps={{ shrink: true }} />
                <TextField type="date" label="Data final"   value={endDate}   onChange={(e) => setEndDate(e.target.value)}   size="small" InputLabelProps={{ shrink: true }} />
              </Box>
            </Box>

            {/* --- o restante é idêntico ao seu original (cards + gráficos) --- */}
            {/* ... (copiei seus componentes de cards e gráficos exatamente como no original) */}
            {/* Coleta em peso (linha) */}
            <Box sx={{ display: "flex", gap: 2, justifyContent: "flex-start", flexWrap: "wrap", mt: 2 }}>
              <Paper sx={{ display: "flex", alignItems: "center", gap: 2, p: "12px 16px", borderRadius: 3, bgcolor: "#FAF1E8", width: 250 }} elevation={1}>
                <Box sx={{ bgcolor: "#F1592A", p: 1.5, borderRadius: "50%", display: "flex", alignItems: "center", justifyContent: "center", width: 44, height: 44 }}>
                  <EnergySavingsLeaf sx={{ color: "white", fontSize: 22 }} />
                </Box>
                <Box>
                  <Typography variant="caption" color="gray">
                    {startDate || endDate? `No período selecionado`: "Últimos 6 meses"}
                  </Typography>
                  <Typography fontWeight={600} fontSize={14}>Consumo de Energia {currentMonthEnergy} MWh</Typography>
                </Box>
              </Paper>

              <Paper sx={{ display: "flex", alignItems: "center", gap: 2, p: "12px 16px", borderRadius: 3, bgcolor: "#FAF1E8", width: 250, ml: 1 }} elevation={1}>
                <Box sx={{ bgcolor: "#005C87", p: 1.5, borderRadius: "50%", display: "flex", alignItems: "center", justifyContent: "center", width: 44, height: 44 }}>
                  <WaterDrop sx={{ color: "white", fontSize: 22 }} />
                </Box>
                <Box>
                  <Typography variant="caption" color="gray">
                    {trueDate()}
                  </Typography>
                  <Typography fontWeight={600} fontSize={14}>Economia de Água {currentMonthAgua}L</Typography>
                </Box>
              </Paper>
            </Box>

            <Box sx={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 3, mt: 4, mb: 4 }}>
              <Paper elevation={1} sx={{ bgcolor: "#FAF1E8", p: 3, borderRadius: 3, minHeight: 300 }}>
                <Typography variant="subtitle1" sx={{ fontWeight: 500, color: "#4B3838", mb: 2 }}>Coleta em peso (kg) por mês</Typography>
                <ResponsiveContainer width="100%" height={200}>
                  <LineChart data={dataLinhaState}>
                    <CartesianGrid strokeDasharray="4 4" vertical={false} />
                    <XAxis dataKey="mes" />
                    <YAxis tickFormatter={(v) => `${v}kg`} />
                    <Tooltip formatter={(v: number) => `${v} kg`} />
                    <Line type="linear" dataKey="peso" stroke="#4B3838" strokeWidth={2} dot={{ fill: "white", strokeWidth: 2, r: 4 }} />
                  </LineChart>
                </ResponsiveContainer>
              </Paper>

              <Box sx={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 2 }}>
                <Paper elevation={1} sx={{ bgcolor: "#FAF1E8", p: 3, borderRadius: 3, minHeight: 300 }}>
                  <Typography variant="subtitle1" sx={{ fontWeight: 500, color: "#4B3838", mb: 2 }}>Tipo de resíduo coletado {startDate || endDate? `no período selecionado`:`nos últimos 6 meses`}</Typography>
                  <ResponsiveContainer width="100%" height={200}>
                    <PieChart>
                      <Pie data={dataResiduos} cx="50%" cy="50%" labelLine={false} outerRadius={90} innerRadius={30} paddingAngle={3} dataKey="value">
                        {dataResiduos.map((e, i) => (<Cell key={`cell-${i}`} fill={COLORS[i % COLORS.length]} />))}
                      </Pie>
                    </PieChart>
                  </ResponsiveContainer>
                  <Box sx={{ display: "flex", flexDirection: "column", mt: 2, gap: 1 }}>
                    {dataResiduos.map((e, i) => (
                      <Box key={e.name} sx={{ display: "flex", alignItems: "center" }}>
                        <Box sx={{ width: 16, height: 16, backgroundColor: COLORS[i % COLORS.length], borderRadius: "50%", mr: 1 }} />
                        <Typography variant="body2" sx={{ color: "#4B3838" }}><b>{e.name}</b> {e.value}%</Typography>
                      </Box>
                    ))}
                  </Box>
                </Paper>

                <Box display="flex" flexDirection="column" gap={2}>
                  {[
                    { icon: <OilBarrel sx={{ color: "white" }} />, bg: "#005C87", label: "PETRÓLEO", value: `${savedOilData}L` },
                    { icon: <Forest sx={{ color: "white" }} />,   bg: "#1FA64C", label: "ÁRVORES POUPADAS", value: `${treeData} Árvores` },
                    { icon: <Delete sx={{ color: "white" }} />,   bg: "#4B3838", label: "ESPAÇO EM ATERRO SANITÁRIO (m²)", value: "3000M²" },
                  ].map((item, i) => (
                    <Paper key={i} sx={{ display: "flex", alignItems: "center", gap: 2, p: 2, borderRadius: 3, bgcolor: "#FAF1E8" }} elevation={1}>
                      <Box sx={{ backgroundColor: item.bg, p: 1.5, borderRadius: "50%", display: "flex", alignItems: "center", justifyContent: "center" }}>
                        {item.icon}
                      </Box>
                      <Box>
                        <Typography variant="caption" color="gray">{item.label}</Typography>
                        <Typography fontWeight={600}>{item.value}</Typography>
                      </Box>
                    </Paper>
                  ))}
                </Box>
              </Box>

              <Paper elevation={1} sx={{ bgcolor: "#FAF1E8", p: 3, borderRadius: 3, minHeight: 300 }}>
                <Typography variant="subtitle1" sx={{ fontWeight: 500, color: "#4B3838", mb: 2 }}>Economia de Água (L) por mês</Typography>
                <ResponsiveContainer width="100%" height={200}>
                  <LineChart data={aguaDataLinha}>
                    <CartesianGrid strokeDasharray="4 4" vertical={false} />
                    <XAxis dataKey="mes" />
                    <YAxis tickFormatter={(v) => `${v}L`} />
                    <Tooltip formatter={(v: number) => `${v} L`} />
                    <Line type="linear" dataKey="litros" stroke="#0070C0" strokeWidth={2} dot={{ fill: "white", strokeWidth: 2, r: 4 }} />
                  </LineChart>
                </ResponsiveContainer>
              </Paper>

              <Paper elevation={1} sx={{ bgcolor: "#FAF1E8", p: 3, borderRadius: 3, minHeight: 300 }}>
                <Typography variant="subtitle1" sx={{ fontWeight: 500, color: "#4B3838", mb: 2 }}>Consumo de Energia (MWh) por mês</Typography>
                <ResponsiveContainer width="100%" height={200}>
                  <BarChart data={energiaData}>
                    <CartesianGrid strokeDasharray="4 4" vertical={false} />
                    <XAxis dataKey="mes" />
                    <YAxis tickFormatter={(v) => `${v}`} />
                    <Tooltip formatter={(v: number) => `${v} MWh`} />
                    <Bar dataKey="mwh" fill="#F1592A" radius={[10, 10, 0, 0]} barSize={10} />
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
