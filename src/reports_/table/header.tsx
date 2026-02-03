import { TableCell, TableRow } from "@mui/material";
import { columns } from "./config";

export const Header = () => {
  return (
    <TableRow>
      {columns.map((column) => (
        <TableCell
          key={column.dataKey}
          variant="head"
          align={column.numeric || false ? "right" : "left"}
          style={{ width: column.width }}
          sx={{ backgroundColor: "#F9F5ED", }}
        >
          {column.label}
        </TableCell>
      ))}
    </TableRow>
  );
};
