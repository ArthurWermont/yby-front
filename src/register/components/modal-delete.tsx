import { Box, Button, Typography } from "@mui/material";
import Modal from "@mui/material/Modal";
import { deleteAdress, deleteClient, deleteUser } from "../../api/client";
//import { toast } from "react-toastify";

const ModalDeleteComponentt = ({
  open,
  handleClose,
  selectedClient,
}: any) => {

  const handleDelete = async () => {
    try {
      await deleteClient(selectedClient.id);
      await deleteUser(selectedClient.idUser);
      await deleteAdress(selectedClient.idAdress);
      alert("Cliente deletado com sucesso!")
      handleClose(); // Fecha o modal se a exclusão for bem-sucedida
      window.location.reload()
    } catch (error) {
      alert('Erro ao excluir o cliente!');
    }
  }
 
  return (
    <>
      <Modal
        open={open}
        onClose={handleClose}
        aria-labelledby="modal-modal-title"
        aria-describedby="modal-modal-description"
      >
        <Box
          sx={{
            position: "absolute",
            top: "50%",
            left: "50%",
            transform: "translate(-50%, -50%)",
            width: 450,
            bgcolor: "background.paper",
            boxShadow: 24,
            padding: "20px",
            zIndex: 1300,
          }}
        >
          <div
            style={{
              display: "flex",
              alignContent: "center",
              flexDirection: "column",
            }}
          >
            <Typography
              style={{ fontWeight: "bold", fontSize: "18px", color: "#4B3838" }}
            >
              Tem certeza que deseja excluir o Usuário {selectedClient.name} de CNPJ {" "}
              {selectedClient.cnpj}?
            </Typography>

            <Typography style={{ fontSize: "14px" }}>
              Essa ação não poderá ser desfeita.
            </Typography>
          </div>
          <div style={{ display: "flex", justifyContent: "end", gap: "16px" }}>
            <Button
              variant="outlined"
              style={{
                marginTop: "20px",
                color: "primary",
                width: "120px",
                height: "42px",
              }}
              onClick={() => handleClose()}
            >
              Cancelar
            </Button>

            <Button
              color="error"
              variant="contained"
              style={{
                marginTop: "20px",
                color: "white",
                width: "80px",
                height: "42px",
              }}
              onClick={() => handleDelete()}
            >
              Sim
            </Button>
          </div>
        </Box>
      </Modal>
    </>
  );
};

export default ModalDeleteComponentt;
