import { Box, TextField } from "@mui/material";
import moment from "moment";
import { FC, MouseEvent } from "react";
import { useDashboardContext } from "../context";

const IntervalInput: FC = () => {
  const { startDate, endDate, changeFilters } = useDashboardContext();

  const onChangeStart = (value: string) => {
    if (!value) return;
    changeFilters({
      startDate: value,
    });
  };

  const onChangeEnd = (value: string) => {
    if (!value) return;
    changeFilters({
      endDate: value,
    });
  };

  const setMonthCurrent = (e: MouseEvent) => {
    e.preventDefault();
    const start = moment().startOf("month").format("YYYY-MM-DD");
    const now = moment().format("YYYY-MM-DD");
    if (`${startDate}${endDate}` == `${start}${now}`) return;
    changeFilters({ startDate: start, endDate: now });
  };

  return (
    <Box display="flex" flexDirection="column">
      <Box display="flex" flexDirection="row" gap={2}>
        <TextField
          type="date"
          label="Data inicial"
          value={startDate}
          onChange={(e) => onChangeStart(e.target.value)}
          size="small"
          InputLabelProps={{ shrink: true }}
        />
        <TextField
          type="date"
          label="Data final"
          value={endDate}
          onChange={(e) => onChangeEnd(e.target.value)}
          size="small"
          InputLabelProps={{ shrink: true }}
        />
      </Box>
      <a href="#" onClick={setMonthCurrent}>
        <small>Mês atual</small>
      </a>
    </Box>
  );
};

export default IntervalInput;
