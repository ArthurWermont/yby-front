import { Paper, Typography } from "@mui/material";
import moment from "moment";
import { FC, memo, useEffect, useState } from "react";
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
  getCollectionsByMonthWater,
  WaterDataType,
} from "../api/dashboard/byMonthWater";
import Loading from "./components/loading";
import { useDashboardContext } from "./context";
import { LineGraphProps } from "./lineGraph";

const LineGraphWater: FC<LineGraphProps> = (props) => {
  const {
    startDate,
    endDate,
    pev: pevId,
    waste: wasteId,
    setReport,
  } = useDashboardContext();
  const [data, setData] = useState<WaterDataType[]>([]);
  const [loading, setLoading] = useState(true);

  const getData = async () => {
    return getCollectionsByMonthWater({
      start: startDate,
      end: endDate,
      pevId,
      wasteId,
    });
  };

  const parseMonth = (data: WaterDataType) => {
    return {
      ...data,
      month: moment(data.month).format("MMM"),
    };
  };

  useEffect(() => {
    if (!startDate || !endDate) return;

    (async () => {
      try {
        setLoading(true);
        const data = await getData();
        const formatedData = data.map(parseMonth);

        setData(formatedData);
        setReport({ waterByMonth: formatedData });
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
            Economia de Água (L) por mês
          </Typography>
          <ResponsiveContainer width="100%" height={200}>
            <LineChart data={data}>
              <CartesianGrid strokeDasharray="4 4" vertical={false} />
              <XAxis dataKey="month" />
              <YAxis tickFormatter={(value) => `${value}L`} width={80} />
              <Tooltip formatter={(value: number) => `${value} L`} />
              <Line
                type="linear"
                dataKey="totalLitros"
                stroke="#0070C0"
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

export default memo(LineGraphWater);
