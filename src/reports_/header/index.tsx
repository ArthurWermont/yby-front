import { Typography } from "@mui/material";
import { Exports } from "./exports";
import { Filters } from "./filters";

export const Header = () => {
  return (
    <div id="header">
      <Typography
        style={{ fontSize: "32px", fontWeight: "600", color: "#4B3838" }}
      >
        Relatórios
      </Typography>

      <Filters />
      <Exports />
    </div>
  );
};
