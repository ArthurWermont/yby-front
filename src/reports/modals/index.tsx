import { useReportsContext } from "../context";
import ModalDeleteComponent from "./modal-delete";
import ModalFormComponent from "./modal-form";
import ModalImageComponent from "./modal-image";

export const Modals = () => {
  const {
    modalDelete,
    modalForm,
    modalImage,
    onDelete,
    onForm,
    onImage,
    selectedRow,
  } = useReportsContext();

  return (
    <>
      {modalImage && (
        <ModalImageComponent
          open={modalImage}
          handleClose={() => onImage(false)}
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

      {modalForm && (
        <ModalFormComponent
          open={modalForm}
          handleClose={() => onForm(false)}
          data={selectedRow}
        />
      )}

      {modalDelete && (
        <ModalDeleteComponent
          open={modalDelete}
          handleClose={() => onDelete(false)}
          documentId={selectedRow?.documentId}
        />
      )}
    </>
  );
};
