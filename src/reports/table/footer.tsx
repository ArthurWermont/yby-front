import {
  Box,
  CircularProgress,
  TableCell,
  TableRow,
  Typography,
} from "@mui/material";
import type { TableState } from ".";
import { columns } from "./config";

export const Footer = ({ state }: { state: TableState }) => {
  const colLength = columns.length;

  return (
    <TableRow>
      <TableCell
        colSpan={colLength}
        align="center"
        sx={{
          backgroundColor: "grey.50",
          padding: 2,
          borderTop: "2px solid",
          borderColor: "divider",
          position: "sticky",
          bottom: 0,
        }}
      >
        <Box
          sx={{
            display: "flex",
            gap: "1rem",
            alignItems: "center",
            width: "100%",
          }}
        >
          {state.data.length > 0 && (
            <Typography variant="body2" fontWeight="medium">
              {state.data.length} de {state.pagination?.total}
            </Typography>
          )}

          <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
            {state.loading && (
              <>
                <CircularProgress size={16} />
                <Typography variant="caption" color="text.secondary">
                  Carregando...
                </Typography>
              </>
            )}
          </Box>

          {!state.loading && (
            <Typography variant="caption" color="text.secondary">
              {state.hasMore
                ? "Role para baixo para mais"
                : "Todos os dados carregados"}
            </Typography>
          )}
        </Box>
      </TableCell>
    </TableRow>
  );
};
