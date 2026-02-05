import { format } from "date-fns";
import { useContext, useState } from "react";
import { AuthContext } from "../context/auth-context";
import { reportService } from "../services/Report.service";
import { useReportsContext } from "./context";
import { Header } from "./header";
import ModalDeleteComponent from "./modals/modal-delete";
import ModalFormComponent from "./modals/modal-form";
import ModalComponent from "./modals/modal-image";
import { Styles } from "./styles";
import { ReportTable } from "./table";
import { TableActions } from "./table/actions";
import type { TableData } from "./table/interfaces";

const Report = () => {
  const { search } = useReportsContext();
  const { user: currentUser } = useContext(AuthContext);
  const isClient = !!currentUser?.client_id;

  const [selectedRow, setSelectedRow] = useState<TableData | null>(null);
  const [openModalEdit, setOpenModalEdit] = useState(false);
  const [openModalImage, setOpenModalImage] = useState(false);
  const [openModalDelete, setOpenModalDelete] = useState(false);

  const openForm = (row: TableData) => {
    setOpenModalEdit(true);
    setSelectedRow(row);
  };

  const openDelete = (row: TableData) => {
    setOpenModalDelete(true);
    setSelectedRow(row);
  };

  const openImage = (row: TableData) => {
    setOpenModalImage(true);
    setSelectedRow(row);
  };

  const fetchData = async ({ page }: { page: number }) => {
    const { data: reportData, meta } = await reportService.getData({
      documentId: currentUser?.client_id,
      isAdmin: !isClient,
      page,
      limit: 5,
      search,
    });

    return {
      data: parseTableData(reportData),
      pagination: meta.pagination,
    };
  };

  const parseTableData = (data: any[] = []) => {
    return data.map((collection: any) => {
      const wastes =
        collection?.wastes.map((item: any) => item.name).join(", ") || "";
      const wastesIds = collection?.wastes.map((item: any) => item.id);

      const formattedCollection: TableData = {
        id: collection.id || "",
        documentId: collection.documentId,

        pev: collection?.client?.social_name || "",

        waste: wastes || "",
        wastesIds: wastesIds || [],

        weight: collection?.weight || "",

        cooperative: collection?.cooperative.cooperative_name || "",

        imageAvaria: collection?.breakdown?.url || "",
        imageColectorUrl: collection.colector?.url || "",
        hasAvaria: Boolean(collection?.breakdown?.url) ? "Sim" : "Não",

        createdAt: format(collection?.createdAt, "dd/MM/yyyy | HH:mm") || "",
      } as TableData;

      formattedCollection.actions = (
        <TableActions
          rowData={formattedCollection}
          onEdit={openForm}
          onDelete={openDelete}
          onViewImage={openImage}
          isClient={isClient}
        />
      );

      return formattedCollection;
    });
  };

  return (
    <>
      {openModalImage && (
        <ModalComponent
          open={openModalImage}
          handleClose={() => setOpenModalImage(false)}
          images={
            selectedRow
              ? {
                  imageColector: selectedRow.imageColectorUrl,
                  imageAvaria: selectedRow.imageAvaria,
                }
              : undefined
          }
        />
      )}

      {openModalEdit && (
        <ModalFormComponent
          open={openModalEdit}
          handleClose={() => setOpenModalEdit(false)}
          data={selectedRow}
        />
      )}

      {openModalDelete && (
        <ModalDeleteComponent
          open={openModalDelete}
          handleClose={() => setOpenModalDelete(false)}
          documentId={selectedRow?.documentId}
        />
      )}

      <Styles>
        <Header />
        <ReportTable fetchData={fetchData} />
      </Styles>
    </>
  );
};

export default Report;
