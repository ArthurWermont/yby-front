import {
  Paper,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
} from "@mui/material";
import { forwardRef } from "react";
import type { TableComponents } from "react-virtuoso";
import type { ColumnData, TableData } from "./interfaces";

export const columns: ColumnData[] = [
  {
    dataKey: "id",
    label: "ID",
    width: 100,
  },
  {
    dataKey: "createdAt",
    label: "Data | Horário",
    width: 200,
  },
  {
    width: 150,
    label: "PEV",
    dataKey: "pev",
  },
  {
    width: 200,
    label: "Tipo de Resíduos",
    dataKey: "waste",
  },
  {
    width: 150,
    label: "Coleta (Kg/L)",
    dataKey: "weight",
  },
  {
    width: 150,
    label: "Avaria",
    dataKey: "hasAvaria",
  },
  {
    width: 200,
    label: "Cooperativa",
    dataKey: "cooperative",
  },
  {
    width: 150,
    label: "Ações",
    dataKey: "actions",
  },
];

export const virtuosoTableComponents: TableComponents<TableData> = {
  Scroller: forwardRef((props, ref) => (
    <TableContainer component={Paper} {...props} ref={ref} />
  )),
  Table: (props) => (
    <Table
      {...props}
      sx={{ borderCollapse: "separate", tableLayout: "fixed" }}
    />
  ),
  TableHead: forwardRef<HTMLTableSectionElement>((props, ref) => (
    <TableHead {...props} ref={ref} />
  )),
  TableRow,
  TableBody: forwardRef<HTMLTableSectionElement>((props, ref) => (
    <TableBody {...props} ref={ref} />
  )),
};

export const rowContent = (_index: number, row: TableData) => {
  return (
    <>
      {columns.map((column) => (
        <TableCell key={column.dataKey}>{row[column.dataKey]}</TableCell>
      ))}
    </>
  );
};
