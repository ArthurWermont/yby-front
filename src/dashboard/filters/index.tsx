import {
  Box,
} from "@mui/material";
import type { FC } from "react";
import IntervalInput from "./intervalInput";
import PevInput from "./pevInput";
import WasteInput from "./wasteInput";

const Filters: FC = () => {
  return (
    <Box
      display="flex"
      justifyContent="space-between"
      alignItems="flex-start"
      marginTop={3}
      marginBottom={3}
      flexWrap="wrap"
    >
      <Box display="flex" gap={2} flexWrap="wrap">
        <PevInput />
        <WasteInput />
        <IntervalInput />
      </Box>
    </Box>
  );
};

export default Filters;
