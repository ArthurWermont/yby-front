import { yupResolver } from "@hookform/resolvers/yup";
import DeleteIcon from "@mui/icons-material/Delete";
import ImageIcon from "@mui/icons-material/Image";
import {
  Box,
  Button,
  Chip,
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
import { editCollection, editCollectionItem } from "../../api/collection";

const parseNumber = (value: unknown): number => {
  const parsed = Number(String(value ?? "").replace(",", "."));
  return Number.isFinite(parsed) ? parsed : 0;
};

const createSchema = (hasItems: boolean) =>
  yup.object().shape({
    residuos: hasItems
      ? yup.array()
      : yup
          .array()
          .required("Residuos é obrigatório")
          .min(1, "Residuos é obrigatório"),

    weight: hasItems
      ? yup.mixed()
      : yup
          .number()
          .typeError("Peso precisa ser um número")
          .required("Peso é obrigatório"),

    justify: yup.string().required("Justificação é obrigatória"),
    collection_dateDate: yup.string().required("Data da Coleta é obrigatória"),
    collection_dateTime: yup.string().required("Hora da Coleta é obrigatória"),
  });

const ModalFormComponent = ({ open, handleClose, data }: any) => {
  const documentId = data.documentId;
  const hasItems = Array.isArray(data?.items) && data.items.length > 0;

  const { control, handleSubmit, setValue } = useForm({
    defaultValues: {
      residuos: [],
      weight: data.weight || "",
      justify: "",
      collection_dateDate: "",
      collection_dateTime: "",
    },
    resolver: yupResolver(createSchema(hasItems)),
  });

  const [loading, setLoading] = useState(false);

  const [coletorImage, setColetorImage] = useState<any>(true);
  const [avariaImage, setAvariaImage] = useState<any>(true);

  const [itemWeights, setItemWeights] = useState<Record<string, string>>({});

  const sortedItems = hasItems
    ? data.items
        .slice()
        .sort((a: any, b: any) => Number(a.order || 0) - Number(b.order || 0))
    : [];

  const getItemImage = (item: any, index: number) => {
    const order = item.order || index + 1;

    return (
      data?.itemImages?.find(
        (image: any) => Number(image.order) === Number(order),
      )?.imageColector || ""
    );
  };

  const totalItems = sortedItems.length;

  const totalItemsWithImage = sortedItems.filter((item: any, index: number) =>
    Boolean(getItemImage(item, index)),
  ).length;

  const getItemKey = (item: any, index: number) => {
    return item.documentId || String(item.id || index);
  };

  const updateItemWeight = (item: any, index: number, value: string) => {
    const key = getItemKey(item, index);

    setItemWeights((prev) => ({
      ...prev,
      [key]: value,
    }));
  };

  const totalEditedWeight = hasItems
    ? sortedItems.reduce((total: number, item: any, index: number) => {
        const key = getItemKey(item, index);
        const value = itemWeights[key] ?? item.weight_kg;
        return total + parseNumber(value);
      }, 0)
    : 0;

  const onSubmit = async (formData: any) => {
    setLoading(true);

    try {
      const collection_date = new Date(
        `${formData.collection_dateDate}T${formData.collection_dateTime}:00`,
      ).toISOString();

      if (hasItems) {
        const updatedItems = sortedItems.map((item: any, index: number) => {
          const key = getItemKey(item, index);
          const newWeight = parseNumber(itemWeights[key]);

          if (!item.documentId) {
            throw new Error(
              `Não foi possível identificar o item ${index + 1} para edição.`,
            );
          }

          if (!newWeight || newWeight <= 0) {
            throw new Error(
              `Informe um peso válido em kg para o item ${index + 1}.`,
            );
          }

          return {
            documentId: item.documentId,
            weight_kg: Number(newWeight.toFixed(2)),
          };
        });

        const newTotalWeight = updatedItems.reduce(
          (total: number, item: any) => total + Number(item.weight_kg || 0),
          0,
        );

        for (const item of updatedItems) {
          const response = await editCollectionItem({
            documentId: item.documentId,
            data: {
              weight_kg: item.weight_kg,
            },
          });

          if (!response) {
            throw new Error(
              `Não foi possível atualizar o peso do item ${item.documentId}.`,
            );
          }
        }

        await editCollection({
          documentId,
          data: {
            justification: formData.justify,
            collection_date,
            weight: String(Number(newTotalWeight.toFixed(2))),
            ...(avariaImage === false && { breakdown: null }),
          },
        });
      } else {
        await editCollection({
          documentId,
          data: {
            justification: formData.justify,
            weight: formData.weight.toString(),
            wastes: formData.residuos,
            collection_date,
            ...(coletorImage === false && { colector: null }),
            ...(avariaImage === false && { breakdown: null }),
          },
        });
      }

      setLoading(false);
      handleClose();
      window.location.reload();
    } catch (error: any) {
      console.error(error);
      alert(error?.message || "Erro ao editar coleta.");
      setLoading(false);
    }
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

  useEffect(() => {
    if (!open || !hasItems) return;

    const initialWeights: Record<string, string> = {};

    sortedItems.forEach((item: any, index: number) => {
      const key = getItemKey(item, index);
      initialWeights[key] = String(item.weight_kg ?? "");
    });

    setItemWeights(initialWeights);
  }, [open, hasItems, data?.items]);

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

              {hasItems ? (
                <Box>
                  <Box
                    sx={{
                      display: "flex",
                      justifyContent: "space-between",
                      alignItems: "flex-start",
                      gap: 1,
                      mb: 1.5,
                    }}
                  >
                    <Box>
                      <Typography sx={{ fontSize: "14px", fontWeight: 800 }}>
                        Itens da coleta
                      </Typography>

                      <Typography
                        sx={{ fontSize: "12px", color: "#777", mt: 0.3 }}
                      >
                        Esta coleta possui múltiplos resíduos vinculados.
                      </Typography>
                    </Box>

                    <Chip
                      size="small"
                      label={`${totalItemsWithImage}/${totalItems} com foto`}
                      sx={{
                        backgroundColor:
                          totalItemsWithImage === totalItems
                            ? "#EEF8F0"
                            : "#FFF7E6",
                        color:
                          totalItemsWithImage === totalItems
                            ? "#15853B"
                            : "#9A6A00",
                        fontWeight: 700,
                      }}
                    />
                  </Box>

                  {sortedItems.map((item: any, index: number) => {
                    const itemImage = getItemImage(item, index);
                    const hasImage = Boolean(itemImage);

                    return (
                      <Box
                        key={item.documentId || item.id || index}
                        sx={{
                          p: 1.5,
                          border: hasImage
                            ? "1px solid #BFE3C8"
                            : "1px solid #E3ECE4",
                          borderRadius: "12px",
                          mb: 1,
                          backgroundColor: "#F8FBF8",
                        }}
                      >
                        <Box
                          sx={{
                            display: "flex",
                            justifyContent: "space-between",
                            gap: 1,
                            alignItems: "flex-start",
                          }}
                        >
                          <Box>
                            <Typography
                              sx={{ fontSize: "14px", fontWeight: 800 }}
                            >
                              Item {item.order || index + 1} —{" "}
                              {item?.waste_name || "Resíduo"}
                            </Typography>

                            <Typography
                              sx={{ fontSize: "13px", color: "#666", mt: 0.3 }}
                            >
                              Peso atual:{" "}
                              <strong>
                                {Number(item.weight_kg || 0).toLocaleString(
                                  "pt-BR",
                                )}{" "}
                                kg
                              </strong>
                            </Typography>

                            <TextField
                              label="Peso corrigido em kg"
                              size="small"
                              value={itemWeights[getItemKey(item, index)] ?? ""}
                              onChange={(event) =>
                                updateItemWeight(
                                  item,
                                  index,
                                  event.target.value,
                                )
                              }
                              fullWidth
                              sx={{ mt: 1 }}
                              helperText="A quantidade original será mantida como histórico."
                            />
                          </Box>

                          <Chip
                            size="small"
                            label={hasImage ? "Com foto" : "Sem foto"}
                            sx={{
                              backgroundColor: hasImage ? "#EEF8F0" : "#F5F5F5",
                              color: hasImage ? "#15853B" : "#9A9A9A",
                              fontWeight: 700,
                            }}
                          />
                        </Box>

                        <Box
                          sx={{
                            display: "flex",
                            flexWrap: "wrap",
                            gap: 0.8,
                            mt: 1,
                          }}
                        >
                          <Chip
                            size="small"
                            label={`Quantidade original: ${item.original_quantity || "-"} ${
                              item.original_unit || ""
                            }`}
                            sx={{
                              backgroundColor: "#FFFFFF",
                              color: "#555",
                            }}
                          />

                          {item.collector_volume_breakdown?.total_liters && (
                            <Chip
                              size="small"
                              label={`Total em litros: ${item.collector_volume_breakdown.total_liters} L`}
                              sx={{
                                backgroundColor: "#FFFFFF",
                                color: "#555",
                              }}
                            />
                          )}
                        </Box>
                      </Box>
                    );
                  })}

                  <Box
                    sx={{
                      mt: 1.5,
                      p: 1.5,
                      borderRadius: "10px",
                      backgroundColor: "#EEF8F0",
                      border: "1px solid #BFE3C8",
                    }}
                  >
                    <Typography
                      sx={{
                        fontSize: "13px",
                        color: "#14532D",
                        fontWeight: 700,
                      }}
                    >
                      Total recalculado da coleta:{" "}
                      {Number(totalEditedWeight || 0).toLocaleString("pt-BR")}{" "}
                      kg
                    </Typography>

                    <Typography
                      sx={{ fontSize: "12px", color: "#4B5563", mt: 0.4 }}
                    >
                      Esse valor será salvo como o novo peso total da coleta
                      mãe.
                    </Typography>
                  </Box>

                  <Box
                    sx={{
                      mt: 1.5,
                      p: 1.5,
                      borderRadius: "10px",
                      backgroundColor: "#FFF8E8",
                      border: "1px solid #F3DCA0",
                    }}
                  >
                    <Typography
                      sx={{
                        fontSize: "12px",
                        color: "#8A5A00",
                        lineHeight: 1.5,
                      }}
                    >
                      A edição de peso deve ser feita em kg. A quantidade
                      original, a unidade original, o resíduo e as evidências
                      fotográficas serão mantidos como histórico da coleta.
                    </Typography>
                  </Box>
                </Box>
              ) : (
                <>
                  <div>
                    <Controller
                      name={"residuos"}
                      control={control}
                      render={({ field, fieldState }) => (
                        <FormControl fullWidth>
                          <InputLabel id="residuos">
                            Tipo de residuos
                          </InputLabel>
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
                        />
                        {fieldState.error && (
                          <FormHelperText style={{ color: "red" }}>
                            {fieldState.error.message}
                          </FormHelperText>
                        )}
                      </FormControl>
                    )}
                  />
                </>
              )}

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
                {hasItems ? (
                  <>
                    <Typography
                      sx={{
                        fontSize: "14px",
                        fontWeight: 600,
                        color: "#333",
                        mb: 1,
                      }}
                    >
                      COLETORES POR ITEM
                    </Typography>

                    <Box
                      sx={{
                        display: "flex",
                        flexDirection: "column",
                        gap: 1,
                      }}
                    >
                      {sortedItems.map((item: any, index: number) => {
                        const itemImage = getItemImage(item, index);
                        const hasImage = Boolean(itemImage);

                        return (
                          <Box
                            key={`image-status-${item.documentId || item.id || index}`}
                            sx={{
                              display: "flex",
                              flexDirection: "row",
                              alignItems: "center",
                              backgroundColor: "#F4F8F4",
                              border: "1px solid #E3ECE4",
                              padding: "10px 12px",
                              borderRadius: "12px",
                              justifyContent: "space-between",
                              gap: 1,
                            }}
                          >
                            <Box
                              sx={{
                                display: "flex",
                                gap: "10px",
                                flexDirection: "row",
                                alignItems: "center",
                              }}
                            >
                              <ImageIcon
                                style={{
                                  color: hasImage ? "#15853B" : "#C7C4C2",
                                }}
                              />

                              <Box>
                                <Typography
                                  sx={{
                                    fontSize: "14px",
                                    fontWeight: 700,
                                    color: "#4B5563",
                                  }}
                                >
                                  Item {item.order || index + 1} —{" "}
                                  {item?.waste_name || "Resíduo"}
                                </Typography>

                                <Typography
                                  sx={{
                                    fontSize: "12px",
                                    color: hasImage ? "#15853B" : "#9A9A9A",
                                  }}
                                >
                                  {hasImage
                                    ? "Imagem do coletor vinculada"
                                    : "Sem imagem do coletor"}
                                </Typography>
                              </Box>
                            </Box>

                            <Chip
                              size="small"
                              label={hasImage ? "Com foto" : "Sem foto"}
                              sx={{
                                backgroundColor: hasImage
                                  ? "#EEF8F0"
                                  : "#F5F5F5",
                                color: hasImage ? "#15853B" : "#9A9A9A",
                                fontWeight: 700,
                              }}
                            />
                          </Box>
                        );
                      })}
                    </Box>

                    <Typography
                      sx={{
                        fontSize: "12px",
                        color: "#9A6A00",
                        mt: 1,
                        lineHeight: 1.5,
                      }}
                    >
                      A troca ou remoção de fotos por item será feita em uma
                      etapa própria de edição das evidências.
                    </Typography>
                  </>
                ) : (
                  <>
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
                            style={{
                              color: coletorImage ? "#9B9794" : "#C7C4C2",
                            }}
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
                  </>
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
                {data.imageAvaria ? (
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
