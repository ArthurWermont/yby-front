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
import { IconButton } from "@mui/material";
import DeleteIcon from "@mui/icons-material/Delete";
import ModalDeleteComponentt from './components/modal-delete';


export default function BasicTable() {
  const [guardarClientes, setGuardarClientes] = useState<any[]>([]);
  const { user: currentUser } = useContext(AuthContext);
  const [openModalD, setOpenModalD] = useState(false);
  const [formData, setFormData] = useState<any>();


  const HandleCloseModal = ()=>{
    setOpenModalD(false)
  }

  const HandleOpenModal = (cliente:any)=>{
    setFormData(cliente)
    setOpenModalD(true)
  }


  const isClient = !!currentUser?.client_id;

  const formatCollection = (data: any) => {
    return data.map((collection: any) => ({
      name: collection?.social_name || "",  // Substituindo para o nome real do cliente
      cnpj: collection?.cnpj || "",
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
  }, [isClient, currentUser?.documentId]);


  return (
    <div>
      <TableContainer component={Paper}>
        <Table sx={{ minWidth: 650 }} aria-label="clientes table">
          <TableHead>
            <TableRow>
              <TableCell>Nome</TableCell>
              <TableCell align="right">CNPJ</TableCell>
              <TableCell align="right">Telefone</TableCell>
              <TableCell align="right">Ação</TableCell>
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
                <TableCell align="right">{cliente.phone}</TableCell>
                <TableCell align="right">
                  <IconButton size="medium" onClick={(e: React.MouseEvent<HTMLButtonElement, MouseEvent>) => HandleOpenModal(cliente)}>
                    <DeleteIcon style={{ color: "#9B9794" }} />
                  </IconButton>

                  {openModalD && (
                    <ModalDeleteComponentt
                      open={openModalD}
                      handleClose={HandleCloseModal}
                      clienteSelecionado={formData}
                    />
                  )}

                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>
    </div>
  );
}
