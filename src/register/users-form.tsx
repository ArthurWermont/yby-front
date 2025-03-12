import * as React from 'react';
import Table from '@mui/material/Table';
import TableBody from '@mui/material/TableBody';
import TableCell from '@mui/material/TableCell';
import TableContainer from '@mui/material/TableContainer';
import TableHead from '@mui/material/TableHead';
import TableRow from '@mui/material/TableRow';
import Paper from '@mui/material/Paper';
import { useContext, useEffect, useState } from "react";
import { getClients, getSingleClients } from '../api/client';
import { AuthContext } from "../context/auth-context";

export default function BasicTable() {
  const [guardarClientes, setGuardarClientes] = useState<any[]>([]);
  const { user: currentUser } = useContext(AuthContext);

  const isClient = !!currentUser?.client_id;

  const formatCollection = (data: any) => {
    return data.map((collection: any) => ({
      name: collection?.social_name || "",  // Substituindo para o nome real do cliente
      cnpj: collection?.cnpj || "",
      email: collection?.email || "",
      responsible_name: collection?.responsible_name || "",
      phone: collection?.phone || "",
    }));
  };


  useEffect(() => {
    if (isClient) {
      const getCollectionsData = async () => {
        const response = await getSingleClients({
          clientId: currentUser?.documentId,
        });
        const formattedData = formatCollection(response.data);
        setGuardarClientes(formattedData);
      };
      getCollectionsData();
    } else {
      const getCollectionsData = async () => {
        const response = await getClients();
        const formattedData = formatCollection(response.data);
        setGuardarClientes(formattedData);
      };

      getCollectionsData();
    }
  }, [isClient,currentUser?.documentId]);

  return (
    <TableContainer component={Paper}>
      <Table sx={{ minWidth: 650 }} aria-label="clientes table">
        <TableHead>
          <TableRow>
            <TableCell>Nome</TableCell>
            <TableCell align="right">CNPJ</TableCell>
            <TableCell align="right">Email</TableCell>
            <TableCell align="right">Responsável</TableCell>
            <TableCell align="right">Telefone</TableCell>
          </TableRow>
        </TableHead>
        <TableBody>
          {guardarClientes.map((cliente) => (
            <TableRow
              key={cliente.name}
              sx={{ '&:last-child td, &:last-child th': { border: 0 } }}
            >
              <TableCell component="th" scope="row">
                {cliente.name}
              </TableCell>
              <TableCell align="right">{cliente.cnpj}</TableCell>
              <TableCell align="right">{cliente.email}</TableCell>
              <TableCell align="right">{cliente.responsible_name}</TableCell>
              <TableCell align="right">{cliente.phone}</TableCell>
            </TableRow>
          ))} 
        </TableBody>
      </Table>
    </TableContainer>
  );
}
