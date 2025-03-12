import DeleteIcon from "@mui/icons-material/Delete";
import EditIcon from "@mui/icons-material/Edit";
import ImageIcon from "@mui/icons-material/Image";
import { IconButton } from "@mui/material";

import {
  DataGrid,
  GridColDef,
  GridToolbarContainer,
  GridToolbarExport,
} from "@mui/x-data-grid";
import { format } from "date-fns";
import { useContext, useEffect, useState } from "react";

import { AuthContext } from "../../context/auth-context";
import ModalDeleteComponent from "./modal-delete";
import ModalFormComponent from "./modal-form";
import ModalComponent from "./modal-image";

const localizedTextsMap = {
  columnMenuUnsort: "Não classificado",
  columnMenuSortAsc: "Classificar por ordem crescente",
  columnMenuSortDesc: "Classificar por ordem decrescente",
  columnMenuFilter: "Filtro",
  columnMenuHideColumn: "Ocultar",
  columnMenuShowColumns: "Mostrar colunas",
  columnMenuExpandGroup: "Expandir grupo",
  columnMenuManageColumns: "Gerenciar colunas",
  toolbarExport: "Exportar",
  filterPanelColumns: "Colunas",
  filterPanelOperators: "Operadores",
  filterPanelInputLabel: "Valor",
  filterOperatorContains: "Contém",
  filterOperatorDoesNotContain: "Não contém",
  filterOperatorEquals: "Igual",
  filterOperatorDoesNotEqual: "Não igual",
  filterOperatorStartsWith: "Começa com",
  filterOperatorEndsWith: "Termina com",
  filterOperatorIs: "Igual",
  filterOperatorNot: "Não",
  filterOperatorAfter: "Após",
  filterOperatorOnOrAfter: "Em ou após",
  filterOperatorBefore: "Antes",
  filterOperatorOnOrBefore: "Em ou antes",
  filterOperatorIsEmpty: "Vazio",
  filterOperatorIsNotEmpty: "Não vazio",
  filterOperatorIsAnyOf: "Qualquer um de",
};

const TableComponent = ({ collections, refreshPage }: any) => {
  const { user: currentUser } = useContext(AuthContext);
  const isAdmin = !!currentUser?.isAdmin;

  const [rows, setRows] = useState<any>([]);
  const [open, setOpen] = useState(false);
  const [openModalForm, setOpenModalForm] = useState(false);
  const [openModalDelete, setOpenModalDelete] = useState(false);
  const [formData, setFormData] = useState<any>();

  const [images, setImages] = useState<any>();

  const columnsAdmin: GridColDef[] = [
    { field: "createdAt", headerName: "Data | Horário", width: 250 },
    { field: "pev", headerName: "PEV", width: 200 },
    { field: "waste", headerName: "Tipos de resíduos", width: 270 },
    {
      field: "weight",
      headerName: "Coleta (kg)",
      sortable: false,
      width: 150,
    },
    {
      field: "fotos",
      headerName: "Registro em fotos",
      sortable: false,
      width: 160,
      renderCell: (params) => {
        const onClick = (e: { stopPropagation: () => void }) => {
          e.stopPropagation();
          setOpen(true);
          setImages({
            imageColector: params.row.imageColectorUrl,
            imageAvaria: params.row.imageAvaria,
          });
        };

        return (
          <>
            <IconButton onClick={onClick} size="medium">
              <ImageIcon style={{ color: "#9B9794" }} />
            </IconButton>
          </>
        );
      },
    },
    {
      field: "action",
      headerName: "Ações",
      width: 100,
      sortable: false,
      renderCell: (params) => {
        const onClick = (e: { stopPropagation: () => void }) => {
          e.stopPropagation();
          setOpenModalForm(true);
          setFormData(params.row);
        };
        const onDelete = async (e: { stopPropagation: () => void }) => {
          e.stopPropagation();
          setOpenModalDelete(true);
          setFormData(params.row);
        };

        return (
          <>
            <IconButton onClick={onClick} size="medium">
              <EditIcon style={{ color: "#9B9794" }} />
            </IconButton>
            <IconButton onClick={onDelete} size="medium">
              <DeleteIcon style={{ color: "#9B9794" }} />
            </IconButton>
          </>
        );
      },
    },
  ];

  const columnsClient: GridColDef[] = [
    { field: "createdAt", headerName: "Data | Horário", width: 250 },
    { field: "pev", headerName: "PEV", width: 200 },
    { field: "waste", headerName: "Tipos de resíduos", width: 270 },
    {
      field: "weight",
      headerName: "Coleta (kg)",
      width: 150,
    },
    {
      field: "fotos",
      headerName: "Registro em fotos",
      sortable: false,
      filterable: false,
      width: 160,
      renderCell: (params) => {
        const onClick = (e: { stopPropagation: () => void }) => {
          e.stopPropagation();
          setOpen(true);
          setImages({
            imageColector: params.row.imageColectorUrl,
            imageAvaria: params.row.imageAvaria,
          });
        };

        return (
          <>
            <IconButton onClick={onClick} size="medium">
              <ImageIcon style={{ color: "#9B9794" }} />
            </IconButton>
          </>
        );
      },
    },
  ];

  useEffect(() => {
    const formatCollection = (data: any) => {
      const formattedData = data.map((collection: any) => {
        return {
          documentId: collection.documentId,
          id: collection.id,
          pev: collection.pev,
          waste: collection.waste,
          weight: collection.weight,
          createdAt: format(collection.createdAt, "dd/MM/yyyy | HH:mm"),
          imageAvaria: collection.imageAvaria,
          imageColectorUrl: collection.imageColectorUrl,
          wastesIds: collection.wastesIds,
        };
      });

      return formattedData;
    };

    const formattedCollections = formatCollection(collections);
    setRows(formattedCollections);
  }, [collections]);

  function CustomToolbar() {
    return (
      <GridToolbarContainer
        sx={{ backgroundColor: "#f0f0f0", padding: "10px" }}
      >
        <GridToolbarExport
          slotProps={{
            button: {
              color: "primary",
              sx: {
                backgroundColor: "primary.main",
                color: "#F9F5ED",
                "&:hover": {
                  backgroundColor: "primary.dark",
                },
              },
            },
          }}
        />
      </GridToolbarContainer>
    );
  }

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

      <div style={{ width: "100%", marginTop: "32px" }}>
        <DataGrid
          rows={rows}
          columns={isAdmin ? columnsAdmin : columnsClient}
          sx={{
            ".MuiDataGrid-toolbarContainer": {
              backgroundColor: "#F9F5ED",
              justifyContent: "end",
              paddingRight: "40px",
            },
            ".MuiDataGrid-columnSeparator": {
              display: "none",
            },

            ".MuiDataGrid-container--top [role=row]": {
              background: "#F9F5ED",
            },

            ".MuiDataGrid-columnHeaders": {
              fontWeight: 400,
              fontSize: "14px",
            },

            ".MuiDataGrid-sortIcon": {
              opacity: "inherit !important",
            },
            ".MuiDataGrid-iconButtonContainer": {
              marginLeft: "80px !important",
            },
            ".MuiDataGrid-footerContainer": {
              display: "none",
            },
          }}
          loading={false}
          slots={{
            toolbar: CustomToolbar,
          }}
          localeText={localizedTextsMap}
        />
      </div>
    </>
  );
};

export default TableComponent;
