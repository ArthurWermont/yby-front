import { Paper, Typography } from "@mui/material";
import moment from "moment";
import { type FC, memo, useEffect, useState } from "react";
import {
  CartesianGrid,
  Line,
  LineChart,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";
import {
  type WeightDataType,
  getCollectionsByMonth,
  getDashboardSummary,
} from "../api/dashboard";
import Loading from "./components/loading";
import { useDashboardContext } from "./context";

export interface LineGraphProps {}

const LineGraph: FC<LineGraphProps> = () => {
  const {
    startDate,
    endDate,
    pev: pevId,
    waste: wasteId,
    setReport,
  } = useDashboardContext();
  const [data, setData] = useState<WeightDataType[]>([]);
  const [loading, setLoading] = useState(true);

  const getData = async () => {
    return getCollectionsByMonth({
      start: startDate,
      end: endDate,
      pevId,
      wasteId,
    });
  };

  const getDataSummary = async () => {
    return getDashboardSummary({
      start: startDate,
      end: endDate,
      pevId,
      wasteId,
    });
  };

  const parseMonth = (data: WeightDataType) => {
    return {
      ...data,
      month: moment(data.month).format("MMM"),
    };
  };

  useEffect(() => {
    console.log(startDate, endDate);
    if (!startDate || !endDate) return;

    (async () => {
      try {
        setLoading(true);
        const data = await getData();
        const formatedData = data.map(parseMonth);

        const dataSummary = await getDataSummary();
        const summary = dataSummary.data.totalWeight;
        setData(formatedData);
        setReport({ weightByMonth: formatedData, weightSummary: summary });
      } finally {
        setLoading(false);
      }
    })();
  }, [startDate, endDate, pevId, wasteId]);

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
      {loading ? (
        <Loading message="Carregando dados do Dashboard..." />
      ) : (
        <>
          <Typography
            variant="subtitle1"
            sx={{ fontWeight: 500, color: "#4B3838", mb: 2 }}
          >
            Coleta em peso (kg) por mês
          </Typography>
          <ResponsiveContainer width="100%" height={200}>
            <LineChart data={data}>
              <CartesianGrid strokeDasharray="4 4" vertical={false} />
              <XAxis dataKey="month" />
              <YAxis tickFormatter={(value) => `${value}kg`} width={80} />
              <Tooltip
                formatter={(value: number | undefined) => `${value} kg`}
              />
              <Line
                type="linear"
                dataKey="totalWeight"
                stroke="#4B3838"
                strokeWidth={2}
                dot={{ fill: "white", strokeWidth: 2, r: 4 }}
              />
            </LineChart>
          </ResponsiveContainer>
        </>
      )}
    </Paper>
  );
};

export default memo(LineGraph);
