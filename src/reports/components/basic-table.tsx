import DeleteIcon from "@mui/icons-material/Delete";
import EditIcon from "@mui/icons-material/Edit";
import ImageIcon from "@mui/icons-material/Image";
import {
  IconButton,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
} from "@mui/material";
import { format } from "date-fns";
import { useContext, useEffect, useState } from "react";
import { AuthContext } from "../../context/auth-context";
import ModalDeleteComponent from "./modal-delete";
import ModalFormComponent from "./modal-form";
import ModalComponent from "./modal-image";

const TableComponent = ({ collections, refreshPage }: any) => {
  const { user: currentUser } = useContext(AuthContext);
  const isAdmin = !!currentUser?.isAdmin;

  const [rows, setRows] = useState<any>([]);
  const [open, setOpen] = useState(false);
  const [openModalForm, setOpenModalForm] = useState(false);
  const [openModalDelete, setOpenModalDelete] = useState(false);
  const [formData, setFormData] = useState<any>();
  const [images, setImages] = useState<any>();

  // Formatando as coleções
  useEffect(() => {
    const formatCollection = (data: any) => {
      const formattedData = data.map((collection: any) => ({
        documentId: collection.documentId,
        id: collection.id,
        pev: collection.pev,
        waste: collection.waste,
        weight: collection.weight,
        createdAt: format(collection.createdAt, "dd/MM/yyyy | HH:mm"),
        hasAvaria: collection.imageAvaria ? "Sim" : "Não",
        imageAvaria: collection.imageAvaria,
        imageColectorUrl: collection.imageColectorUrl,
        wastesIds: collection.wastesIds,
        cooperative: collection.cooperative.cooperative_name,
      }));
      setRows(formattedData);
    };

    formatCollection(collections);
  }, [collections]);

  // Ações para editar e excluir
  const handleEdit = (data: any) => {
    setOpenModalForm(true);
    setFormData(data);
  };

  const handleDelete = (data: any) => {
    setOpenModalDelete(true);
    setFormData(data);
  };

  const handleViewImage = (data: any) => {
    setOpen(true);
    setImages({
      imageColector: data.imageColectorUrl,
      imageAvaria: data.imageAvaria,
    });
  };

  // Definindo as colunas
  const columns = isAdmin
    ? [
        { label: "Data | Horário", key: "createdAt", width: 200 },
        { label: "PEV", key: "pev", width: 150 },
        { label: "Tipo de Resíduos", key: "waste", width: 200 },
        { label: "Coleta (kg)", key: "weight", width: 150 },
        { label: "Avaria", key: "hasAvaria", width: 150 },
        { label: "Cooperativa", key: "cooperative", width: 200 },
        { label: "Ações", key: "actions", width: 150 },
      ]
    : [
        { label: "Data | Horário", key: "createdAt", width: 200 },
        { label: "PEV", key: "pev", width: 150 },
        { label: "Tipo de Resíduos", key: "waste", width: 200 },
        { label: "Coleta (kg)", key: "weight", width: 150 },
      ];

  if (rows.length === 0) {
    return <></>;
  }

  return (
    <>
      {open && (
        <ModalComponent
          open={open}
          handleClose={() => setOpen(false)}
          images={images}
        />
      )}

      {openModalForm && (
        <ModalFormComponent
          open={openModalForm}
          handleClose={() => setOpenModalForm(false)}
          data={formData}
        />
      )}

      {openModalDelete && (
        <ModalDeleteComponent
          open={openModalDelete}
          handleClose={() => setOpenModalDelete(false)}
          documentId={formData?.documentId}
        />
      )}

      <TableContainer style={{ marginTop: "32px", border: "1px solid #ccc" }}>
        <Table>
          <TableHead>
            <TableRow style={{ backgroundColor: "rgba(221, 195, 147, 0.2)" }}>
              {columns.map((column) => (
                <TableCell key={column.key} style={{ width: column.width }}>
                  {column.label}
                </TableCell>
              ))}
            </TableRow>
          </TableHead>
          <TableBody>
            {rows.map((row: any) => (
              <TableRow key={row.id}>
                {columns.map((column) => {
                  if (column.key === "actions" && isAdmin) {
                    return (
                      <TableCell key={column.key}>
                        <IconButton onClick={() => handleEdit(row)}>
                          <EditIcon style={{ color: "#9B9794" }} />
                        </IconButton>
                        <IconButton onClick={() => handleDelete(row)}>
                          <DeleteIcon style={{ color: "#9B9794" }} />
                        </IconButton>
                        <IconButton onClick={() => handleViewImage(row)}>
                          <ImageIcon style={{ color: "#9B9794" }} />
                        </IconButton>
                      </TableCell>
                    );
                  }

                  return (
                    <TableCell key={column.key}>{row[column.key]}</TableCell>
                  );
                })}
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>
    </>
  );
};

export default TableComponent;
