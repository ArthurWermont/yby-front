import { FC, memo, useEffect, useState } from "react";
import { LineGraphProps } from "./lineGraph";
import {
  EnergyDataType,
  getCollectionsByMonthEnergy,
} from "../api/dashboard/byMonthEnergy";
import moment from "moment";
import { Paper, Typography } from "@mui/material";
import {
  ResponsiveContainer,
  BarChart,
  CartesianGrid,
  XAxis,
  YAxis,
  Tooltip,
  Bar,
} from "recharts";
import Loading from "./components/loading";
import { useDashboardContext } from "./context";

const LineGraphEnergy: FC<LineGraphProps> = (props) => {
  const {
    startDate,
    endDate,
    pev: pevId,
    waste: wasteId,
    setReport,
  } = useDashboardContext();
  const [data, setData] = useState<EnergyDataType[]>([]);
  const [loading, setLoading] = useState(true);

  const getData = async () => {
    return getCollectionsByMonthEnergy({
      start: startDate,
      end: endDate,
      pevId,
      wasteId,
    });
  };

  const parseMonth = (data: EnergyDataType) => {
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
        setReport({ energyByMonth: formatedData });
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
            Consumo de Energia (MWh) por mês
          </Typography>
          <ResponsiveContainer width="100%" height={200}>
            <BarChart data={data}>
              <CartesianGrid strokeDasharray="4 4" vertical={false} />
              <XAxis dataKey="month" />
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
        </>
      )}
    </Paper>
  );
};

export default memo(LineGraphEnergy);
