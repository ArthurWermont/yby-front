import { Delete, Forest, MonetizationOn, OilBarrel } from "@mui/icons-material";
import InfoOutlinedIcon from "@mui/icons-material/InfoOutlined";
import { Box, IconButton, Paper, Tooltip, Typography } from "@mui/material";
import moment from "moment";
import { type FC, memo, useEffect, useState } from "react";
import {
  getCollectionsByMonthOil,
  getCollectionsByMonthTree,
  getDashboardSummaryLandFillSpace,
  getDashboardSummaryOil,
  getDashboardSummaryRecoveredValue,
  getDashboardSummaryTree,
  type OilDataType,
  type TreeDataType,
} from "../api/dashboard";
import { useDashboardContext } from "./context";

const BoxesTreeOil: FC = () => {
  const {
    startDate,
    endDate,
    selectedPevs,
    waste: wasteId,
    setReport,
  } = useDashboardContext();
  const [summaryTree, setSummaryTree] = useState<any>(0);
  const [summaryOil, setSummaryOil] = useState<any>(0);
  const [summaryRecoveredValue, setSummaryRecoveredValue] = useState<any>(0);
  const [summaryLandFillSpace, setSummaryLandFillSpace] = useState<any>(0);

  const pevKey = selectedPevs.join("|");

  const getDataByMonthTree = async () => {
    return getCollectionsByMonthTree({
      start: startDate,
      end: endDate,
      pevId: selectedPevs,
      wasteId,
    });
  };

  const getDataByMonthOil = async () => {
    return getCollectionsByMonthOil({
      start: startDate,
      end: endDate,
      pevId: selectedPevs,
      wasteId,
    });
  };

  const parseMonth = (data: TreeDataType | OilDataType) => {
    return {
      ...data,
      month: moment(data.month).format("MMM"),
    };
  };

  useEffect(() => {
    const fetchSummaryTree = async () => {
      const response = await getDashboardSummaryTree({
        start: startDate,
        end: endDate,
        pevId: selectedPevs,
        wasteId,
      });

      const data = await getDataByMonthTree();
      const formatedDataTree = data.map(parseMonth) as TreeDataType[];

      setSummaryTree(response.data.totalTrees);
      setReport({
        treeSummary: response.data.totalTrees,
        treeByMonth: formatedDataTree,
      });
    };

    const fetchSummaryOil = async () => {
      const response = await getDashboardSummaryOil({
        start: startDate,
        end: endDate,
        pevId: selectedPevs,
        wasteId,
      });

      const data = await getDataByMonthOil();
      const formatedDataOil = data.map(parseMonth) as OilDataType[];

      setSummaryOil(response.data.totalOil);
      setReport({
        oilSummary: response.data.totalOil,
        oilBymonth: formatedDataOil,
      });
    };

    const fetchSummaryRecoveredValue = async () => {
      const response = await getDashboardSummaryRecoveredValue({
        start: startDate,
        end: endDate,
        pevId: selectedPevs,
        wasteId,
      });

      setSummaryRecoveredValue(response.data.totalRecoveredValue);
      setReport({ recoveredValueSummary: response.data.totalRecoveredValue });
    };

    const fetchSummaryLandFillSpace = async () => {
      const response = await getDashboardSummaryLandFillSpace({
        start: startDate,
        end: endDate,
        pevId: selectedPevs,
        wasteId,
      });

      setSummaryLandFillSpace(response.data.totalLandfillSpace);
      setReport({
        landFillSpaceSummary: response.data.totalLandfillSpace,
      });
    };

    fetchSummaryTree();
    fetchSummaryOil();
    fetchSummaryRecoveredValue();
    fetchSummaryLandFillSpace();
  }, [pevKey, startDate, endDate, wasteId]);

  const formatNumber = (value: number) => {
    return value.toLocaleString("pt-BR", {
      minimumFractionDigits: 2,
      maximumFractionDigits: 2,
    });
  };

  return (
    <Box display="flex" flexDirection="column" gap={2}>
      {[
        {
          icon: <MonetizationOn sx={{ color: "white" }} />,
          bg: "#2E7D32",
          label: "BENEFÍCIO SOCIOAMBIENTAL",
          value: "R$ " + formatNumber(summaryRecoveredValue),
          tooltip:
            "Valor estimado do retorno positivo para a sociedade gerado pela reciclagem dos materiais coletados.",
        },
        {
          icon: <OilBarrel sx={{ color: "white" }} />,
          bg: "#005C87",
          label: "PETRÓLEO",
          value: formatNumber(summaryOil) + " L",
        },
        {
          icon: <Forest sx={{ color: "white" }} />,
          bg: "#1FA64C",
          label: "ÁRVORES POUPADAS",
          value: formatNumber(summaryTree) + " Árvores",
        },
        {
          icon: <Delete sx={{ color: "white" }} />,
          bg: "#4B3838",
          label: "ESPAÇO EM ATERRO SANITÁRIO (m³)",
          value: formatNumber(summaryLandFillSpace) + " M³",
        },
      ].map((item, i) => (
        <Paper
          key={i}
          sx={{
            position: "relative",
            display: "flex",
            alignItems: "center",
            gap: 2,
            padding: 2,
            borderRadius: 3,
            backgroundColor: "#FAF1E8",
          }}
          elevation={1}
        >
          {item.tooltip && (
            <Box
              sx={{
                position: "absolute",
                top: 6,
                right: 6,
              }}
            >
              <Tooltip title={item.tooltip}>
                <IconButton size="small" sx={{ color: "#8A8A8A" }}>
                  <InfoOutlinedIcon sx={{ fontSize: 16 }} />
                </IconButton>
              </Tooltip>
            </Box>
          )}

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
  );
};

export default memo(BoxesTreeOil);
