import CloseIcon from "@mui/icons-material/Close";
import { Box, IconButton, Typography } from "@mui/material";
import Modal from "@mui/material/Modal";

const ModalComponent = ({ open, handleClose, images }: any) => {
  return (
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
          width: 600,
          bgcolor: "background.paper",
          boxShadow: 24,
          padding: "20px",
        }}
      >
        <div
          style={{
            display: "flex",
            justifyContent: "space-between",
            alignContent: "center",
          }}
        >
          <Typography id="modal-modal-title" variant="h6" component="h2">
            Registro de foto do PEV
          </Typography>
          <IconButton onClick={handleClose} size="medium">
            <CloseIcon />
          </IconButton>
        </div>

        <div
          style={{
            marginTop: "20px",
            display: "flex",
            flexDirection: "row",
            alignItems: "center",
            justifyContent: "space-between",
          }}
        >
          <div>
            <Typography style={{ marginBottom: "10px", fontSize: "12px" }}>
              COLETOR
            </Typography>
            <div
              style={{
                padding: "10px",
                border: "1px solid #15853B",
                borderRadius: "2px",
              }}
            >
              <img
                width="250"
                height="250"
                src={`${images?.imageColector}`}
                alt="Imagem"
              />
            </div>
          </div>

          {images?.imageAvaria && (
            <div>
              <Typography style={{ marginBottom: "10px", fontSize: "12px" }}>
                AVARIA
              </Typography>
              <div
                style={{
                  padding: "10px",
                  border: "1px solid #15853B",
                  borderRadius: "2px",
                }}
              >
                <img
                  width="250"
                  height="250"
                  src={`http://3.88.210.55:1337${images?.imageAvaria}`}
                  alt="Imagem"
                />
              </div>
            </div>
          )}
        </div>
      </Box>
    </Modal>
  );
};

export default ModalComponent;
