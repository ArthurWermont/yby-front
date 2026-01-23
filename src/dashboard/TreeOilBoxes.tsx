import { OilBarrel, Forest, Delete } from "@mui/icons-material";
import { Box, Paper, Typography } from "@mui/material";
import { FC, memo, useEffect, useState } from "react";
import { useDashboardContext } from "./context";
import {
  getCollectionsByMonthOil,
  getCollectionsByMonthTree,
  getDashboardSummaryOil,
  getDashboardSummaryTree,
  OilDataType,
  TreeDataType,
} from "../api/dashboard";
import moment from "moment";

const BoxesTreeOil: FC = (props) => {
  const {
    startDate,
    endDate,
    pev: pevId,
    waste: wasteId,
    setReport,
  } = useDashboardContext();
  const [summaryTree, setSummaryTree] = useState<any>(0);
  const [summaryOil, setSummaryOil] = useState<any>(0);

  const getDataByMonthTree = async () => {
    return getCollectionsByMonthTree({
      start: startDate,
      end: endDate,
      pevId,
      wasteId,
    });
  };

  const getDataByMonthOil = async () => {
    return getCollectionsByMonthOil({
      start: startDate,
      end: endDate,
      pevId,
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
        pevId,
        wasteId,
      });

      const data = await getDataByMonthTree();
      console.log(data);
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
        pevId,
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

    fetchSummaryTree();
    fetchSummaryOil();
  }, [pevId, startDate, endDate, wasteId]);

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
          icon: <OilBarrel sx={{ color: "white" }} />,
          bg: "#005C87",
          label: "PETRÓLEO",
          value: formatNumber(summaryOil) + "L",
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
            <Typography fontWeight={600}>{item.value}</Typography>
          </Box>
        </Paper>
      ))}
    </Box>
  );
};

export default memo(BoxesTreeOil);
