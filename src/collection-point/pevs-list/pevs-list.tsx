import CheckCircleIcon from "@mui/icons-material/CheckCircle";
import CloseIcon from "@mui/icons-material/Close";
import TuneIcon from "@mui/icons-material/Tune";
import {
  Box,
  Button,
  Card,
  IconButton,
  Modal,
  TextField,
  Typography,
} from "@mui/material";
import { Key, useState } from "react";

export const PEVSList = ({
  pevs,
  handleSelectedPevs,
}: {
  handleSelectedPevs: any;
  pevs: any;
}) => {
  const [open, setOpen] = useState(false);
  const handleOpen = () => setOpen(true);
  const handleClose = () => setOpen(false);

  return (
    <>
      <Modal
        open={open}
        onClose={handleClose}
        style={{
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
          backgroundColor: "rgba(255, 255, 255, 0.8)",
          position: "fixed",
          top: "0",
          left: "0",
          width: "100%",
          height: "100%",
          zIndex: "9999",
        }}
      >
        <Box
          sx={{
            backgroundColor: "white",
            padding: "20px",
            borderRadius: "10px",
            width: "80%",
            height: "160px",
            display: "flex",
            flexDirection: "column",

            justifyContent: "space-between",
            maxWidth: "400px",
          }}
        >
          <div
            style={{
              display: "flex",
              flexDirection: "row",
              justifyContent: "space-between",
              alignItems: "center",
              marginBottom: "20px",
            }}
          >
            <Typography
              id="modal-modal-title"
              variant="h6"
              component="h2"
              sx={{
                fontWeight: "bold",
              }}
            >
              Filtrar dias da semana
            </Typography>
            <IconButton onClick={handleClose} size="medium">
              <CloseIcon />
            </IconButton>
          </div>

          {/* <WeekDayToggle /> */}

          <Button
            variant="contained"
            color="primary"
            style={{ marginTop: "20px", width: "100%", color: "white" }}
          >
            Aplicar filtro
          </Button>
        </Box>
      </Modal>
      <div
        style={{
          display: "flex",
          flexDirection: "column",
          justifyContent: "center",
          gap: "10px",
          marginTop: "20px",
          width: "100%",
          alignItems: "center",
        }}
      >
        <div style={{ display: "flex", alignItems: "center", width: "100%" }}>
          <TextField
            style={{ marginRight: 10, flex: 1 }}
            label="Pesquisar"
            variant="outlined"
            size="small"
          />
          <IconButton
            size="medium"
            style={{ border: "1px solid #ccc", borderRadius: "4px" }}
            onClick={handleOpen}
          >
            <TuneIcon fontSize="inherit" />
          </IconButton>
        </div>

        {pevs.map(
          (
            pev: {
              adress_data: any;
              social_name: string;
            },
            index: Key
          ) => (
            <Card
              key={index}
              style={{
                display: "flex",
                flexDirection: "column",
                width: "95%",
                backgroundColor: " rgba(221, 195, 147, 0.2)",
                padding: "10px",
                gap: "8px",
                flex: 1,
              }}
            >
              <div
                style={{
                  display: "flex",
                  flexDirection: "row",
                  justifyContent: "space-between",
                  alignItems: "center",
                }}
              >
                <Typography style={{ fontWeight: "600", fontSize: "16px" }}>
                  {pev.social_name}
                </Typography>
                <div
                  style={{
                    border: "1px solid #ccc",
                    backgroundColor: "transparent",
                    padding: "1px 2px",
                    display: "flex",
                    alignItems: "center",
                    borderRadius: "5px",
                    justifyContent: "center",
                    height: "24px",
                  }}
                >
                  <CheckCircleIcon
                    style={{ fontSize: 14, marginRight: 10, color: "green" }}
                  />
                  <Typography style={{ fontSize: "14px" }}>
                    Disponível
                  </Typography>
                </div>
              </div>
              <Typography style={{ fontWeight: "400", fontSize: "14px" }}>
                {`${pev.adress_data[0].street},No.${pev.adress_data[0].number}, ${pev.adress_data[0].neighborhood}, ${pev.adress_data[0].city}, ${pev.adress_data[0].state}, cep:${pev.adress_data[0].cep}`}
              </Typography>

              <Button
                variant="outlined"
                color="primary"
                style={{
                  padding: "8px 16px",
                  borderRadius: "5px",
                  width: "100%",
                }}
                onClick={() => handleSelectedPevs(pev)}
              >
                Coletar aqui
              </Button>
            </Card>
          )
        )}
      </div>
    </>
  );
};
