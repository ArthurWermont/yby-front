import { yupResolver } from "@hookform/resolvers/yup";
import DeleteIcon from "@mui/icons-material/Delete";
import ImageIcon from "@mui/icons-material/Image";
import {
  Box,
  Button,
  CircularProgress,
  FormControl,
  FormHelperText,
  IconButton,
  InputLabel,
  MenuItem,
  Select,
  TextField,
  Typography,
} from "@mui/material";
import Modal from "@mui/material/Modal";
import { useState } from "react";
import { Controller, useForm } from "react-hook-form";
import * as yup from "yup";
import { editCollection } from "../../api/collection";

const schema = yup.object().shape({
  residuos: yup
    .array()
    .required("Residuos é obrigatório")
    .min(1, "Residuos é obrigatório"),
  weight: yup
    .number()
    .typeError("Peso precisa ser um número")
    .required("Peso é obrigatório"),
  justify: yup.string().required("Justificação é obrigatória"),
});

const ModalFormComponent = ({ open, handleClose, data }: any) => {
  const documentId = data.documentId;

  const { control, handleSubmit } = useForm({
    defaultValues: {
      residuos: [],
      weight: data.weight || "",
      justify: "",
    },
    resolver: yupResolver(schema),
  });

  const [loading, setLoading] = useState(false);

  const [coletorImage, setColetorImage] = useState<any>(true);
  const [avariaImage, setAvariaImage] = useState<any>(true);

  const onSubmit = async (data: any) => {
    setLoading(true);
    const formatData = {
      justification: data.justify,
      weight: data.weight.toString(),
      wastes: data.residuos,
      ...(coletorImage === false && { colector: null }),
      ...(avariaImage === false && { breakdown: null }),
    };

    await editCollection({
      documentId,
      data: formatData,
    });
    setLoading(false);
    handleClose();

    window.location.reload();
  };

  return (
    <Modal open={open} onClose={handleClose}>
      <>
        <Box
          sx={{
            position: "absolute",
            top: "50%",
            left: "50%",
            transform: "translate(-50%, -50%)",
            width: 400,
            bgcolor: "background.paper",
            boxShadow: 24,
            padding: "20px",
          }}
        >
          <div
            style={{
              display: "flex",
              gap: "8px",
              flexDirection: "row",
              alignItems: "center",
              justifyContent: "space-between",
            }}
          >
            <Typography id="modal-modal-title" variant="h6" component="h2">
              Editar registro do PEV
            </Typography>
          </div>

          <Typography>
            Clique nos dados abaixo para editar as informações deste PEV.
          </Typography>

          <form
            onSubmit={handleSubmit(onSubmit)}
            style={{
              width: "100%",
              gap: "16px",
              display: "flex",
              flexDirection: "column",
              marginTop: "20px",
            }}
          >
            <div>
              <Controller
                name={"residuos"}
                control={control}
                render={({ field, fieldState }) => (
                  <FormControl fullWidth>
                    <InputLabel id="residuos">Tipo de residuos</InputLabel>
                    <Select
                      {...field}
                      error={fieldState.error ? true : false}
                      labelId="residuos"
                      id="Tipo de residuos"
                      label="Tipo de residuos"
                      multiple
                    >
                      <MenuItem value={"2"}>Papel</MenuItem>
                      <MenuItem value={"1"}>Plástico</MenuItem>
                      <MenuItem value={"3"}>Metal</MenuItem>
                      <MenuItem value={"4"}>Vidro</MenuItem>
                      <MenuItem value={"6"}>Orgânicos</MenuItem>
                      <MenuItem value={"5"}>Reciclaveis Geral</MenuItem>
                    </Select>
                    {fieldState.error && (
                      <FormHelperText style={{ color: "red" }}>
                        {fieldState.error.message}
                      </FormHelperText>
                    )}
                  </FormControl>
                )}
              />
            </div>

            <Controller
              name={"weight"}
              control={control}
              render={({ field, fieldState }) => (
                <FormControl fullWidth>
                  <TextField
                    error={fieldState.error ? true : false}
                    {...field}
                    id="weight"
                    type="text"
                    placeholder="Coleta em kg"
                    label="Coleta em kg"
                  ></TextField>
                  {fieldState.error && (
                    <FormHelperText style={{ color: "red" }}>
                      {fieldState.error.message}
                    </FormHelperText>
                  )}
                </FormControl>
              )}
            />

            <div>
              <Typography style={{ fontSize: "14px" }}>COLETOR</Typography>

              {data.imageColectorUrl ? (
                <div
                  style={{
                    display: "flex",
                    flexDirection: "row",
                    backgroundColor: "rgba(21, 133, 59, 0.08)",
                    padding: "8px",
                    borderRadius: "8px",
                    marginTop: "16px",
                    justifyContent: "space-between",
                  }}
                >
                  <div
                    style={{
                      display: "flex",
                      gap: "8px",
                      flexDirection: "row",
                      alignItems: "center",
                    }}
                  >
                    <ImageIcon
                      style={{ color: coletorImage ? "#9B9794" : "#C7C4C2" }}
                    />
                    <Typography
                      style={{
                        fontSize: "14px",
                        textDecoration: coletorImage ? "none" : "line-through",
                        color: coletorImage ? "#9B9794" : "#C7C4C2",
                      }}
                    >
                      Imagem do coletor
                    </Typography>
                  </div>
                  <IconButton
                    onClick={() => setColetorImage(!coletorImage)}
                    size="medium"
                  >
                    <DeleteIcon style={{ color: "#9B9794" }} />
                  </IconButton>
                </div>
              ) : (
                <Typography style={{ fontSize: "14px", color: "#C7C4C2" }}>
                  Nao possui imagem do coletor
                </Typography>
              )}
            </div>

            <div>
              <Typography style={{ fontSize: "14px" }}>AVARIA</Typography>
              {data.imageAvariaUrl ? (
                <div
                  style={{
                    display: "flex",
                    flexDirection: "row",
                    backgroundColor: "rgba(21, 133, 59, 0.08)",
                    padding: "8px",
                    borderRadius: "8px",
                    marginTop: "16px",
                    justifyContent: "space-between",
                  }}
                >
                  <div
                    style={{
                      display: "flex",
                      gap: "8px",
                      flexDirection: "row",
                      alignItems: "center",
                    }}
                  >
                    <ImageIcon
                      style={{ color: avariaImage ? "#9B9794" : "#C7C4C2" }}
                    />
                    <Typography
                      style={{
                        fontSize: "14px",
                        textDecoration: avariaImage ? "none" : "line-through",
                        color: avariaImage ? "#9B9794" : "#C7C4C2",
                      }}
                    >
                      Imagem da avaria
                    </Typography>
                  </div>

                  <IconButton
                    onClick={() => setAvariaImage(!avariaImage)}
                    size="medium"
                  >
                    <DeleteIcon style={{ color: "#9B9794" }} />
                  </IconButton>
                </div>
              ) : (
                <Typography style={{ fontSize: "14px", color: "#C7C4C2" }}>
                  Nao possui imagem da avaria
                </Typography>
              )}
            </div>
            <div>
              <Typography>Justificativa</Typography>
              <Controller
                name={`justify`}
                control={control}
                render={({ field, fieldState }) => (
                  <FormControl fullWidth>
                    <TextField
                      {...field}
                      style={{ marginTop: "10px" }}
                      id="justify"
                      type="text"
                      placeholder={"Editei o PEV porque..."}
                      fullWidth
                      label={"Motivo da edição"}
                      variant="outlined"
                      size="small"
                      rows={4}
                      multiline
                      autoComplete="off"
                    />

                    {fieldState.error && (
                      <FormHelperText style={{ color: "red" }}>
                        {fieldState.error.message}
                      </FormHelperText>
                    )}
                  </FormControl>
                )}
              />
            </div>

            <div
              style={{ display: "flex", justifyContent: "end", gap: "16px" }}
            >
              <Button
                variant="outlined"
                style={{
                  marginTop: "20px",
                  color: "primary",
                  width: "125px",
                  height: "42px",
                }}
                onClick={handleClose}
              >
                Cancelar
              </Button>

              <Button
                type="submit"
                variant="contained"
                style={{
                  marginTop: "20px",
                  color: "white",
                  width: "100px",
                  height: "42px",
                }}
                disabled={loading}
              >
                {loading ? (
                  <CircularProgress size={24} color="inherit" />
                ) : (
                  "Editar"
                )}
              </Button>
            </div>
          </form>
        </Box>
      </>
    </Modal>
  );
};

export default ModalFormComponent;
