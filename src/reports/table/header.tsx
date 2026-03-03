import { TableCell, TableRow, TableSortLabel } from "@mui/material";
import { useReportsContext } from "../context";
import { columns } from "./config";

export const Header = () => {
  const { search, onSearchChange } = useReportsContext();

  const handleSort = () => {
    onSearchChange?.({
      ...search,
      sortByDate: search.sortByDate === "asc" ? "desc" : "asc",
    });
  };

  return (
    <TableRow>
      {columns.map((column) => {
        if (column.dataKey === "createdAt") {
          return (
            <TableCell
              key={column.dataKey}
              variant="head"
              style={{ width: column.width }}
              sx={{ backgroundColor: "#F9F5ED" }}
            >
              <TableSortLabel
                active
                direction={search.sortByDate}
                onClick={handleSort}
              >
                {column.label}
              </TableSortLabel>
            </TableCell>
          );
        }

        return (
          <TableCell
            key={column.dataKey}
            variant="head"
            style={{ width: column.width }}
            sx={{ backgroundColor: "#F9F5ED" }}
          >
            {column.label}
          </TableCell>
        );
      })}
    </TableRow>
  );
};
