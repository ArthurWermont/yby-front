import AddAPhotoIcon from "@mui/icons-material/AddAPhoto";
import DeleteIcon from "@mui/icons-material/Delete";
import ImageIcon from "@mui/icons-material/Image";
import {
  Button,
  CircularProgress,
  FormControl,
  FormControlLabel,
  FormHelperText,
  IconButton,
  InputLabel,
  MenuItem,
  Radio,
  RadioGroup,
  Select,
  TextField,
  Typography,
} from "@mui/material";
import { styled } from "@mui/system";
import React, { useState } from "react";
import { Controller, useForm } from "react-hook-form";
import { createCollection, uploadImage } from "../../api/collection";
import Leaf from "../../assets/leaf";

import { yupResolver } from "@hookform/resolvers/yup";
import * as yup from "yup";

const StyledImage = styled("img")({
  objectFit: "fill",
  objectPosition: "center",
  width: "100%",
  height: "150px",
  display: "flex",
  justifyContent: "center",
  alignItems: "center",
});

const StyledImagePlaceholder = styled("div")({
  width: "100%",
  height: "150px",
  backgroundColor: "rgba(21, 133, 59, 0.08)",
  border: "2px dashed #15853B",
  display: "flex",
  justifyContent: "center",
  alignItems: "center",
  cursor: "pointer",
  borderRadius: "4px",
});

const schema = yup.object().shape({
  collectionPoint: yup.string().required("Ponto de coleta é obrigatório"),
  residuos: yup
    .array()
    .required("Residuos é obrigatório")
    .min(1, "Residuos é obrigatório"),
  weight: yup.string().required("Peso é obrigatório"),
  coletorImage: yup.string().required("Foto do coletor é obrigatória"),
  avariaImage: yup.string(),
});

export default function CollectionForm({
  selectedPEV,
  pevs,
}: {
  selectedPEV: any;
  pevs: any;
}) {
  const {
    control,
    handleSubmit,
    setError,
    formState: { errors },
    setValue,
  } = useForm({
    defaultValues: {
      collectionPoint: selectedPEV?.id?.toString() || "",
      residuos: [],
      weight: undefined,
      avariaImage: undefined,
      coletorImage: undefined,
    },
    resolver: yupResolver(schema),
  });

  const [coletorFile, setColetorFile] = useState<any>(null);
  const [avariaFile, setAvariaFile] = useState<any>(null);

  const [coletorImage, setColetorImage] = useState<any>(null);
  const [avariaImage, setAvariaImage] = useState<any>(null);
  const [selectedValue, setSelectedValue] = React.useState("no");

  const [loading, setLoading] = useState(false);

  const handleFileChange = (
    event: React.ChangeEvent<HTMLInputElement>,
    setImage: (url: string) => void,
    setFile: (file: File) => void,
    setType: "coletorImage" | "avariaImage"
  ) => {
    if (event?.target?.files) {
      const selectedFile = event.target.files?.[0];
      if (selectedFile) {
        const previewUrl = URL.createObjectURL(selectedFile);
        setImage(previewUrl);
        setFile(selectedFile);
        setValue(setType, previewUrl);
      }
    }
  };

  const handleClearImage = (
    setImage: (url: string) => void,
    setFile: any,
    setType: "coletorImage" | "avariaImage"
  ) => {
    setImage("");
    setFile(null);
    setValue(setType, undefined);
  };

  const onSubmit = async (data: any) => {
    setLoading(true);
    if (!coletorFile) {
      setError("coletorImage", { message: "Foto do coletor é obrigatória" });
      setLoading(false);
      return;
    }
    if (!avariaFile && selectedValue === "yes") {
      setError("avariaImage", { message: "Foto da avaria é obrigatória" });
      setLoading(false);
      return;
    }

    try {
      let responseUploadImage;
      let responseAvariaImage = null;

      try {
        responseUploadImage = await uploadImage(coletorFile);
      } catch (error) {
        console.error("Erro ao fazer upload da foto do coletor:", error);
        responseUploadImage = null;
        setLoading(false);
        return;
      }

      if (avariaFile) {
        try {
          responseAvariaImage = await uploadImage(avariaFile);
        } catch (error) {
          console.error("Erro ao fazer upload da foto da avaria:", error);
          setLoading(false);
          return;
        }
      }

      const { weight, collectionPoint, residuos } = data;

      const wastes = residuos.map((residuo: any) => {
        return {
          id: residuo,
        };
      });

      const formatData = {
        wastes: wastes,
        weight,
        client_id: collectionPoint,
        client: {
          id: collectionPoint,
        },
        colector: responseUploadImage
          ? { id: responseUploadImage[0].id }
          : null,
        breakdown: responseAvariaImage
          ? { id: responseAvariaImage[0].id }
          : null,
      };

      const idsSalvos = localStorage.getItem("ids")
        ? JSON.parse(localStorage.getItem("ids") || "[]")
        : [];
      idsSalvos.push(collectionPoint);
      localStorage.setItem("ids", JSON.stringify(idsSalvos));

      const response = await createCollection(formatData);

      if (!responseUploadImage) {
        alert("Não foi possível fazer o upload da foto do coletor.");
      }

      if (avariaFile && !responseAvariaImage) {
        alert("Não foi possível fazer o upload da foto da avaria.");
      }

      if (response) {
        setLoading(false);
        alert("Coleta registrada com sucesso!");
        window.location.reload();
      }

      return response;
    } catch (error) {
      setLoading(false);
      throw new Error("Falha no upload");
    }
  };

  const handleChangeRadio = (event: React.ChangeEvent<HTMLInputElement>) => {
    setSelectedValue(event.target.value);
  };

  return (
    <div style={{ display: "flex", flexDirection: "column", width: "100%" }}>
      <form
        onSubmit={handleSubmit(onSubmit)}
        style={{
          width: "100%",
          gap: "10px",
          display: "flex",
          flexDirection: "column",
          marginTop: "20px",
        }}
      >
        <div
          style={{
            display: "flex",
            width: "100%",
            marginBottom: "16px",
            alignItems: "center",
            justifyContent: "start",
            flexDirection: "row",
          }}
        >
          <Leaf />
          <Typography
            style={{ marginLeft: "10px", fontSize: "20px", fontWeight: "500" }}
          >
            Sobre a coleta
          </Typography>
        </div>

        <div style={{ display: "flex", flexDirection: "column", gap: "16px" }}>
          <div>
            <Controller
              name={"collectionPoint"}
              control={control}
              render={({ field, fieldState }) => (
                <FormControl fullWidth sx={{ maxWidth: "350px" }}>
                  <InputLabel id="collectionPoint">Ponto de coleta</InputLabel>
                  <Select
                    error={fieldState.error ? true : false}
                    {...field}
                    labelId="collectionPoint"
                    id="Ponto de coleta"
                    label="Ponto de coleta"
                  >
                    {pevs.map(
                      (pev: {
                        adress_data: any;
                        id: string;
                        social_name: any;
                        street: any;
                        number: any;
                        neighborhood: any;
                        documentId: any;
                      }) => (
                        <MenuItem value={pev.id}>
                          {`${pev.social_name} - ${pev.adress_data[0].street}, ${pev.adress_data[0].number} - ${pev.adress_data[0].neighborhood} `}
                        </MenuItem>
                      )
                    )}
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

          <div>
            <Controller
              name={"residuos"}
              control={control}
              render={({ field, fieldState }) => (
                <FormControl fullWidth sx={{ maxWidth: "350px" }}>
                  <InputLabel id="residuos">Tipo de residuos</InputLabel>
                  <Select
                    error={fieldState.error ? true : false}
                    {...field}
                    labelId="residuos"
                    id="Tipo de residuos"
                    label="Tipo de residuo"
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
        </div>

        <div
          style={{
            marginTop: "10px",
            display: "flex",
            alignItems: "center",
            justifyContent: "start",
          }}
        >
          <Leaf />
          <Typography
            style={{ marginLeft: "10px", fontSize: "20px", fontWeight: "500" }}
          >
            Carregar fotos
          </Typography>
        </div>

        <div>
          <Typography
            style={{
              fontSize: "14px",
              fontWeight: "500",
              marginBottom: "10px",
              width: "100%",
            }}
          >
            Coletor
          </Typography>
          {coletorImage ? (
            <>
              <StyledImage src={coletorImage} alt="Preview Coletor" />
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
                  onClick={() =>
                    handleClearImage(
                      setColetorImage,
                      setColetorFile,
                      "coletorImage"
                    )
                  }
                  size="medium"
                >
                  <DeleteIcon style={{ color: "#9B9794" }} />
                </IconButton>
              </div>
            </>
          ) : (
            <StyledImagePlaceholder
              onClick={() =>
                document.getElementById("image-upload-coletor")?.click()
              }
            >
              <div style={{ display: "flex", flexDirection: "column" }}>
                <AddAPhotoIcon
                  style={{
                    fontSize: 40,
                    color: "rgb(0, 0, 0, 0.35)",
                    alignSelf: "center",
                    marginBottom: "10px",
                  }}
                />
                <Typography
                  variant="body1"
                  style={{ color: "#4B3838", textAlign: "center" }}
                >
                  Toque para inserir foto do <strong>coletor</strong>
                </Typography>
              </div>
            </StyledImagePlaceholder>
          )}
          <input
            type="file"
            id="image-upload-coletor"
            name="file"
            onChange={(event) =>
              handleFileChange(
                event,
                setColetorImage,
                setColetorFile,
                "coletorImage"
              )
            }
            accept="image/*"
            capture="environment"
            style={{ display: "none" }}
          />

          {errors.coletorImage && (
            <FormHelperText style={{ color: "red" }}>
              {errors.coletorImage.message}
            </FormHelperText>
          )}

          <Controller
            name={`weight`}
            control={control}
            render={({ field, fieldState }) => (
              <FormControl fullWidth sx={{ maxWidth: "350px" }}>
                <TextField
                  style={{ marginTop: "16px" }}
                  {...field}
                  id="weight"
                  placeholder="peso em kg"
                  required
                  label="Peso (kg)"
                  variant="outlined"
                  autoComplete="off"
                  error={fieldState.error ? true : false}
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

        <div style={{ marginTop: "20px" }}>
          <Typography
            style={{
              fontSize: "14px",
              fontWeight: "500",
              marginBottom: "10px",
            }}
          >
            Avaria
          </Typography>

          <div
            style={{
              display: "flex",
              alignItems: "center",
              flexDirection: "row",
              marginBottom: "20px",
              justifyContent: "space-between",
            }}
          >
            <Typography sx={{ fontWeight: "400", width: "150px" }}>
              O seu coletor apresenta avarias (está danificado)?
            </Typography>

            <RadioGroup row value={selectedValue} onChange={handleChangeRadio}>
              <FormControlLabel
                labelPlacement="bottom"
                value="yes"
                control={<Radio />}
                label="Sim"
              />
              <FormControlLabel
                value="no"
                control={<Radio />}
                label="Não"
                labelPlacement="bottom"
              />
            </RadioGroup>
          </div>

          {selectedValue === "yes" && (
            <>
              {avariaImage ? (
                <>
                  <StyledImage src={avariaImage} alt="Preview Avaria" />
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
                      onClick={() =>
                        handleClearImage(
                          setAvariaImage,
                          setAvariaFile,
                          "avariaImage"
                        )
                      }
                      size="medium"
                    >
                      <DeleteIcon style={{ color: "#9B9794" }} />
                    </IconButton>
                  </div>
                </>
              ) : (
                <>
                  <StyledImagePlaceholder
                    onClick={() =>
                      document.getElementById("image-upload-avaria")?.click()
                    }
                  >
                    <div style={{ display: "flex", flexDirection: "column" }}>
                      <AddAPhotoIcon
                        style={{
                          fontSize: 40,
                          color: "rgb(0, 0, 0, 0.35)",
                          alignSelf: "center",
                          marginBottom: "10px",
                        }}
                      />
                      <Typography
                        variant="body1"
                        style={{
                          color: "#4B3838",
                          textAlign: "center",
                        }}
                      >
                        Toque para inserir foto da <strong>Avaria</strong>
                      </Typography>
                    </div>
                  </StyledImagePlaceholder>
                  {errors.avariaImage && (
                    <FormHelperText style={{ color: "red" }}>
                      {errors.avariaImage.message}
                    </FormHelperText>
                  )}
                </>
              )}
              <input
                type="file"
                id="image-upload-avaria"
                name="file"
                onChange={(event) =>
                  handleFileChange(
                    event,
                    setAvariaImage,
                    setAvariaFile,
                    "avariaImage"
                  )
                }
                accept="image/*"
                style={{ display: "none" }}
              />
            </>
          )}
        </div>

        <Button
          style={{ marginTop: "20px", width: "100%", color: "white" }}
          type="submit"
          variant="contained"
          disabled={loading}
        >
          {loading ? (
            <CircularProgress size={24} color="inherit" />
          ) : (
            "Registrar coleta"
          )}
        </Button>
      </form>
    </div>
  );
}
