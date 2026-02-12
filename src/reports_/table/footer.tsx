import {
  Box,
  CircularProgress,
  TableCell,
  TableRow,
  Typography,
} from "@mui/material";
import { columns } from "./config";
import type { TableData } from "./interfaces";

export const Footer = ({
  data,
  loading,
  hasMore,
}: {
  data: TableData[];
  loading: boolean;
  hasMore: boolean;
}) => {
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
            justifyContent: "space-between",
            alignItems: "center",
            width: "100%",
          }}
        >
          <Typography variant="body2" fontWeight="medium">
            Total: {data.length} registros
          </Typography>

          <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
            {loading && (
              <>
                <CircularProgress size={16} />
                <Typography variant="caption" color="text.secondary">
                  Carregando...
                </Typography>
              </>
            )}
          </Box>

          <Typography variant="caption" color="text.secondary">
            {hasMore
              ? "Role para baixo para mais"
              : "Todos os dados carregados"}
          </Typography>
        </Box>
      </TableCell>
    </TableRow>
  );
};
