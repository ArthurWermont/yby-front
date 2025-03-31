import DeleteIcon from "@mui/icons-material/Delete";
import { Card, IconButton } from "@mui/material";
import Table from "@mui/material/Table";
import TableBody from "@mui/material/TableBody";
import TableCell from "@mui/material/TableCell";
import TableContainer from "@mui/material/TableContainer";
import TableHead from "@mui/material/TableHead";
import TableRow from "@mui/material/TableRow";
import { useContext, useEffect, useState } from "react";
import { getClients, getSingleClients } from "../api/client";
import { AuthContext } from "../context/auth-context";
import ModalDeleteComponentt from "./components/modal-delete";

export default function BasicTable() {
  const [saveClients, setSaveClients] = useState<any[]>([]);
  const { user: currentUser } = useContext(AuthContext);
  const [openModalD, setOpenModalD] = useState(false);
  const [formData, setFormData] = useState<any>();

  const handleOpenModal = (cliente: any) => {
    setFormData(cliente);
    setOpenModalD(true);
  };

  const isClient = !!currentUser?.client_id;

  const formatCollection = (data: any) => {
    return data.map((collection: any) => ({
      name: collection?.social_name || "", // Substituindo para o nome real do cliente
      cnpj: collection?.cnpj || "",
      phone: collection?.phone || "",
      id: collection?.id || "",
    }));
  };
  
  useEffect(() => {
    if (isClient) {
      const getCollectionsData = async () => {
        const response = await getSingleClients({
          clientId: currentUser?.documentId,
        });
        const formattedData = formatCollection(response.data);
        setSaveClients(formattedData);
      };
      getCollectionsData();
    } else {
      const getCollectionsData = async () => {
        const response = await getClients();
        const formattedData = formatCollection(response.data);
        setSaveClients(formattedData);
      };

      getCollectionsData();
    }
  }, [isClient, currentUser?.documentId]);

  return (
    <div>
      <TableContainer component={Card}>
        <Table sx={{ minWidth: 650 }} aria-label="clientes table" >
          <TableHead >
            <TableRow style={{backgroundColor:'#F9F5ED'}}>
              <TableCell style={{color:'black'}}>Nome</TableCell>
              <TableCell style={{color:'black'}} align="right">CNPJ</TableCell>
              <TableCell style={{color:'black'}} align="right">Telefone</TableCell>
              <TableCell style={{color:'black'}} align="right">Ação</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {saveClients.map((cliente) => (
              <TableRow
                key={cliente.name}
                sx={{ "&:last-child td, &:last-child th": { border: 0 } }}
              >
                <TableCell component="th" scope="row">
                  {cliente.name}
                </TableCell>
                <TableCell align="right">{cliente.cnpj}</TableCell>
                <TableCell align="right">{cliente.phone}</TableCell>
                <TableCell align="right">
                  <IconButton
                    size="medium"
                    onClick={() => handleOpenModal(cliente)}
                  >
                    <DeleteIcon style={{ color: "#9B9794" }} />
                  </IconButton>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>

      {openModalD && (
        <ModalDeleteComponentt
          open={openModalD}
          handleClose={() => setOpenModalD(false)}
          selectedClient={formData}
        />
      )}
    </div>
  );
}
