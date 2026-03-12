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
import Stack from "@mui/material/Stack";
import { useEffect, useState } from "react";
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
  collection_dateDate: yup.string().required("Data da Coleta é obrigatória"),
  collection_dateTime: yup.string().required("Hora da Coleta é obrigatória"),
});

const ModalFormComponent = ({ open, handleClose, data }: any) => {
  const documentId = data.documentId;

  const { control, handleSubmit, setValue } = useForm({
    defaultValues: {
      residuos: [],
      weight: data.weight || "",
      justify: "",
      collection_dateDate: "",
      collection_dateTime: "",
    },
    resolver: yupResolver(schema),
  });

  const [loading, setLoading] = useState(false);

  const [coletorImage, setColetorImage] = useState<any>(true);
  const [avariaImage, setAvariaImage] = useState<any>(true);

  const onSubmit = async (data: any) => {
    setLoading(true);

    const collection_date = new Date(
      `${data.collection_dateDate}T${data.collection_dateTime}:00`,
    ).toISOString();

    const formatData = {
      justification: data.justify,
      weight: data.weight.toString(),
      wastes: data.residuos,
      collection_date,
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

  useEffect(() => {
    if (!data?.collection_date) return;

    const [datePartRaw, timePartRaw] = data.collection_date
      .split("|")
      .map((s: any) => s.trim());

    const [dd, mm, yyyy] = datePartRaw.split("/");

    const dateForInput = `${yyyy}-${mm.padStart(2, "0")}-${dd.padStart(2, "0")}`;
    const timeForInput = timePartRaw || "00:00";

    setValue("collection_dateDate", dateForInput);
    setValue("collection_dateTime", timeForInput);
  }, [data?.collection_date, setValue]);

  return (
    <Modal open={open} onClose={handleClose}>
      <>
        <Box
          sx={{
            position: "absolute",
            top: "50%",
            left: "50%",
            transform: "translate(-50%, -50%)",
            width: 500,
            maxWidth: "92vw",
            bgcolor: "background.paper",
            boxShadow: "0 18px 45px rgba(0,0,0,0.18)",
            borderRadius: "16px",
            maxHeight: "88vh",
            overflow: "hidden",
            display: "flex",
            flexDirection: "column",
          }}
        >
          <Box
            sx={{
              px: 3,
              pt: 3,
              pb: 2,
              borderBottom: "1px solid rgba(0,0,0,0.06)",
            }}
          >
            <Typography
              sx={{
                fontSize: "20px",
                fontWeight: 600,
                color: "#1F1F1F",
                lineHeight: 1.2,
              }}
            >
              Editar registro do PEV
            </Typography>

            <Typography
              variant="body2"
              sx={{
                mt: 0.8,
                color: "#666",
                fontSize: "14px",
                lineHeight: 1.5,
              }}
            >
              Clique nos dados abaixo para editar as informações deste PEV.
            </Typography>
          </Box>

          <Box
            sx={{
              flex: 1,
              overflowY: "auto",
              px: 3,
              pt: 2.5,
              pb: 2,
            }}
          >
            <form
              id="edit-collection-form"
              onSubmit={handleSubmit(onSubmit)}
              style={{
                width: "100%",
                gap: "18px",
                display: "flex",
                flexDirection: "column",
              }}
            >
              <Typography
                sx={{
                  fontSize: "13px",
                  fontWeight: 700,
                  color: "#4F4F4F",
                  letterSpacing: "0.04em",
                  textTransform: "uppercase",
                  mb: -0.5,
                }}
              >
                Dados da coleta
              </Typography>

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
                        <MenuItem value={"7"}>Óleo</MenuItem>
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
                      size="small"
                    ></TextField>
                    {fieldState.error && (
                      <FormHelperText style={{ color: "red" }}>
                        {fieldState.error.message}
                      </FormHelperText>
                    )}
                  </FormControl>
                )}
              />

              <Typography
                sx={{
                  fontSize: "13px",
                  fontWeight: 700,
                  color: "#4F4F4F",
                  letterSpacing: "0.04em",
                  textTransform: "uppercase",
                  pt: 1,
                  mb: -0.5,
                }}
              >
                Imagens vinculadas
              </Typography>

              <div>
                <Typography
                  sx={{
                    fontSize: "14px",
                    fontWeight: 600,
                    color: "#333",
                    mb: 1,
                  }}
                >
                  COLETOR
                </Typography>

                {data.imageColectorUrl ? (
                  <div
                    style={{
                      display: "flex",
                      flexDirection: "row",
                      alignItems: "center",
                      backgroundColor: "#F4F8F4",
                      border: "1px solid #E3ECE4",
                      padding: "10px 12px",
                      borderRadius: "12px",
                      marginTop: "10px",
                      justifyContent: "space-between",
                    }}
                  >
                    <div
                      style={{
                        display: "flex",
                        gap: "10px",
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
                          fontWeight: 500,
                          textDecoration: coletorImage
                            ? "none"
                            : "line-through",
                          color: coletorImage ? "#6A6A6A" : "#C7C4C2",
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
                  <Typography
                    sx={{
                      fontSize: "13px",
                      color: "#9A9A9A",
                      mt: 0.5,
                    }}
                  >
                    Não possui imagem do coletor
                  </Typography>
                )}
              </div>

              <div>
                <Typography
                  sx={{
                    fontSize: "14px",
                    fontWeight: 600,
                    color: "#333",
                    mb: 1,
                  }}
                >
                  AVARIA
                </Typography>
                {data.imageAvariaUrl ? (
                  <div
                    style={{
                      display: "flex",
                      flexDirection: "row",
                      alignItems: "center",
                      backgroundColor: "#F4F8F4",
                      border: "1px solid #E3ECE4",
                      padding: "10px 12px",
                      borderRadius: "12px",
                      marginTop: "10px",
                      justifyContent: "space-between",
                    }}
                  >
                    <div
                      style={{
                        display: "flex",
                        gap: "10px",
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
                  <Typography
                    sx={{
                      fontSize: "13px",
                      color: "#9A9A9A",
                      mt: 0.5,
                    }}
                  >
                    Não possui imagem da avaria
                  </Typography>
                )}
              </div>

              <Stack
                direction="row"
                spacing={2}
                sx={{
                  alignItems: "flex-start",
                }}
              >
                <Controller
                  name="collection_dateDate"
                  control={control}
                  render={({ field, fieldState }) => (
                    <FormControl fullWidth>
                      <TextField
                        {...field}
                        type="date"
                        size="small"
                        label="Data da Coleta"
                        slotProps={{ inputLabel: { shrink: true } }}
                      />
                      {fieldState.error && (
                        <FormHelperText style={{ color: "red" }}>
                          {fieldState.error.message}
                        </FormHelperText>
                      )}
                    </FormControl>
                  )}
                />

                <Controller
                  name="collection_dateTime"
                  control={control}
                  render={({ field, fieldState }) => (
                    <FormControl sx={{ width: 145 }}>
                      <TextField
                        {...field}
                        type="time"
                        size="small"
                        label="Horário"
                        slotProps={{ inputLabel: { shrink: true } }}
                      />
                      {fieldState.error && (
                        <FormHelperText style={{ color: "red" }}>
                          {fieldState.error.message}
                        </FormHelperText>
                      )}
                    </FormControl>
                  )}
                />
              </Stack>

              <Typography
                sx={{
                  fontSize: "13px",
                  fontWeight: 700,
                  color: "#4F4F4F",
                  letterSpacing: "0.04em",
                  textTransform: "uppercase",
                  pt: 0.5,
                  mb: -0.5,
                }}
              >
                Justificativa da edição
              </Typography>

              <div>
                <Typography
                  sx={{
                    fontSize: "14px",
                    fontWeight: 600,
                    color: "#333",
                    mb: 1,
                  }}
                >
                  Justificativa
                </Typography>

                <Controller
                  name={`justify`}
                  control={control}
                  render={({ field, fieldState }) => (
                    <FormControl fullWidth>
                      <TextField
                        {...field}
                        style={{ marginTop: "4px" }}
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
            </form>
          </Box>

          <Box
            sx={{
              px: 3,
              py: 2,
              backgroundColor: "#fff",
              display: "flex",
              justifyContent: "flex-end",
              gap: 1.5,
              borderTop: "1px solid rgba(0,0,0,0.06)",
            }}
          >
            <Button
              variant="outlined"
              onClick={handleClose}
              style={{ width: 128, height: 42, borderRadius: 10 }}
            >
              Cancelar
            </Button>

            <Button
              form="edit-collection-form"
              type="submit"
              variant="contained"
              disabled={loading}
              style={{ width: 110, height: 42, borderRadius: 10 }}
            >
              {loading ? (
                <CircularProgress size={24} color="inherit" />
              ) : (
                "Editar"
              )}
            </Button>
          </Box>
        </Box>
      </>
    </Modal>
  );
};

export default ModalFormComponent;
