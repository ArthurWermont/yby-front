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
import React, { useContext, useEffect, useState } from "react";
import { Controller, useForm } from "react-hook-form";
import { createCollectionWithItems, uploadImage } from "../../api/collection";
import Leaf from "../../assets/leaf";

import { yupResolver } from "@hookform/resolvers/yup";
import * as yup from "yup";
import { getCooperatives } from "../../api/cooperative";
import { AuthContext } from "../../context/auth-context";
import { CollectorVolumeModal } from "./components/CollectorVolumeModal";
import {
  calculateTotalLiters,
  createEmptyCollectorVolumeCounts,
  type CollectorVolumeCounts,
} from "./constants/collectorVolumes";

const StyledImage = styled("img")({
  objectFit: "cover",
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

type CollectionItemForm = {
  id: string;
  waste: string;
  original_quantity: string;
  original_unit: "kg" | "L";
  collector_volume_breakdown: CollectorVolumeCounts | null;
  coletorFile: File | null;
  coletorImage: string | null;
};

// LOCAL — usar agora no seu ambiente de desenvolvimento
// const wasteOptions = [
//   { id: "1", name: "Papel" },
//   { id: "2", name: "Metal" },
//   { id: "3", name: "Plástico" },
//   { id: "4", name: "Orgânicos" },
//   { id: "5", name: "Recicláveis Geral" },
//   { id: "6", name: "Vidro" },
//   { id: "7", name: "Óleo" },
// ];

// PRODUÇÃO — quando for subir, comente o bloco LOCAL acima e descomente este
const wasteOptions = [
  { id: "1", name: "Plástico" },
  { id: "2", name: "Papel" },
  { id: "3", name: "Metal" },
  { id: "4", name: "Vidro" },
  { id: "5", name: "Recicláveis Geral" },
  { id: "6", name: "Orgânicos" },
  { id: "7", name: "Óleo" },
];

const wasteNamesById: Record<string, string> = wasteOptions.reduce(
  (acc, item) => {
    acc[item.id] = item.name;
    return acc;
  },
  {} as Record<string, string>,
);

const wasteDensities: Record<string, number> = {
  Plástico: 1.41,
  Metal: 2.7,
  Vidro: 2.5,
  Papel: 0.8,
  Orgânicos: 1.1,
  Óleo: 0.9,
  "Recicláveis Geral": 1.4,
};

const createEmptyCollectionItem = (): CollectionItemForm => ({
  id: `${Date.now()}-${Math.random()}`,
  waste: "",
  original_quantity: "",
  original_unit: "kg",
  collector_volume_breakdown: null,
  coletorFile: null,
  coletorImage: null,
});

const parseNumber = (value: unknown): number => {
  const parsed = Number(String(value ?? "").replace(",", "."));
  return Number.isFinite(parsed) ? parsed : 0;
};

const convertToKg = (
  value: number,
  unit: "kg" | "L",
  selectedWasteName: string,
) => {
  if (unit === "kg") return value;

  const density = wasteDensities[selectedWasteName];

  if (!density) {
    throw new Error("Esse resíduo não possui densidade cadastrada.");
  }

  return value * density;
};

const schema = yup.object().shape({
  collectionPoint: yup.string().required("Ponto de coleta é obrigatório"),
});

export default function CollectionForm({
  selectedPEV,
  pevs,
}: {
  selectedPEV: any;
  pevs: any;
}) {
  const { control, handleSubmit } = useForm({
    defaultValues: {
      collectionPoint: selectedPEV?.id?.toString() || "",
    },
    resolver: yupResolver(schema),
  });

  const [collectionItems, setCollectionItems] = useState<CollectionItemForm[]>([
    createEmptyCollectionItem(),
  ]);

  const [collectorModalOpen, setCollectorModalOpen] = useState(false);
  const [activeCollectorItemId, setActiveCollectorItemId] = useState<
    string | null
  >(null);

  const [selectedValue, setSelectedValue] = useState<"yes" | "no">("no");
  const [avariaFile, setAvariaFile] = useState<File | null>(null);
  const [avariaImage, setAvariaImage] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  const { user: currentUser } = useContext(AuthContext);

  const updateCollectionItem = (
    itemId: string,
    field: keyof CollectionItemForm,
    value: any,
  ) => {
    setCollectionItems((prev) =>
      prev.map((item) =>
        item.id === itemId
          ? {
              ...item,
              [field]: value,
            }
          : item,
      ),
    );
  };

  const addCollectionItem = () => {
    setCollectionItems((prev) => [...prev, createEmptyCollectionItem()]);
  };

  const removeCollectionItem = (itemId: string) => {
    setCollectionItems((prev) => {
      if (prev.length === 1) return prev;
      return prev.filter((item) => item.id !== itemId);
    });
  };

  const openCollectorModalForItem = (itemId: string) => {
    setActiveCollectorItemId(itemId);
    setCollectorModalOpen(true);
  };

  const activeCollectorItem = collectionItems.find(
    (item) => item.id === activeCollectorItemId,
  );

  const activeCollectorCounts =
    activeCollectorItem?.collector_volume_breakdown ||
    createEmptyCollectorVolumeCounts();

  const handleConfirmCollectorVolume = (counts: CollectorVolumeCounts) => {
    if (!activeCollectorItemId) return;

    const totalLiters = calculateTotalLiters(counts);

    setCollectionItems((prev) =>
      prev.map((item) =>
        item.id === activeCollectorItemId
          ? {
              ...item,
              original_unit: "L",
              original_quantity: String(totalLiters),
              collector_volume_breakdown: {
                ...counts,
                total_liters: totalLiters,
              } as any,
            }
          : item,
      ),
    );

    setCollectorModalOpen(false);
    setActiveCollectorItemId(null);
  };

  const handleItemFileChange = (
    itemId: string,
    event: React.ChangeEvent<HTMLInputElement>,
  ) => {
    const selectedFile = event.target.files?.[0];

    if (!selectedFile) return;

    const previewUrl = URL.createObjectURL(selectedFile);

    setCollectionItems((prev) =>
      prev.map((item) =>
        item.id === itemId
          ? {
              ...item,
              coletorFile: selectedFile,
              coletorImage: previewUrl,
            }
          : item,
      ),
    );
  };

  const handleClearItemImage = (itemId: string) => {
    const itemToClear = collectionItems.find((item) => item.id === itemId);

    if (itemToClear?.coletorImage) {
      URL.revokeObjectURL(itemToClear.coletorImage);
    }

    setCollectionItems((prev) =>
      prev.map((item) =>
        item.id === itemId
          ? {
              ...item,
              coletorFile: null,
              coletorImage: null,
            }
          : item,
      ),
    );
  };

  const handleAvariaFileChange = (
    event: React.ChangeEvent<HTMLInputElement>,
  ) => {
    const selectedFile = event.target.files?.[0];

    if (!selectedFile) return;

    if (avariaImage) {
      URL.revokeObjectURL(avariaImage);
    }

    const previewUrl = URL.createObjectURL(selectedFile);

    setAvariaFile(selectedFile);
    setAvariaImage(previewUrl);

    event.target.value = "";
  };

  const handleClearAvariaImage = () => {
    if (avariaImage) {
      URL.revokeObjectURL(avariaImage);
    }

    setAvariaFile(null);
    setAvariaImage(null);
  };

  const handleChangeRadio = (event: React.ChangeEvent<HTMLInputElement>) => {
    const value = event.target.value as "yes" | "no";

    setSelectedValue(value);

    if (value === "no") {
      handleClearAvariaImage();
    }
  };

  const [location, setLocation] = useState<{
    latitude: number;
    longitude: number;
  } | null>(null);

  useEffect(() => {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          const { latitude, longitude } = position.coords;
          setLocation({ latitude, longitude });
        },
        (err) => {
          console.error("Erro ao obter localização:", err);
        },
      );
    } else {
    }
  }, []);

  const onSubmit = async (data: any) => {
    setLoading(true);

    try {
      const { collectionPoint } = data;

      if (!collectionItems.length) {
        alert("Adicione pelo menos um resíduo.");
        setLoading(false);
        return;
      }

      if (selectedValue === "yes" && !avariaFile) {
        throw new Error("Adicione a foto da avaria geral da coleta.");
      }

      const payloadItems: any[] = [];

      for (const [index, item] of collectionItems.entries()) {
        if (!item.waste) {
          throw new Error(`Selecione o resíduo do item ${index + 1}.`);
        }

        const originalQuantity = parseNumber(item.original_quantity);

        if (!originalQuantity || originalQuantity <= 0) {
          throw new Error(
            `Informe uma quantidade válida no item ${index + 1}.`,
          );
        }

        if (!item.coletorFile) {
          throw new Error(`Adicione a foto do coletor no item ${index + 1}.`);
        }

        const selectedWasteName = wasteNamesById[String(item.waste)];

        if (!selectedWasteName) {
          throw new Error(`Resíduo inválido no item ${index + 1}.`);
        }

        let weightInKg = originalQuantity;

        if (item.original_unit === "L") {
          weightInKg = convertToKg(
            originalQuantity,
            item.original_unit,
            selectedWasteName,
          );
        }

        const roundedWeightInKg = Number(weightInKg.toFixed(2));

        let uploadedCollectorImage = null;

        if (item.coletorFile) {
          uploadedCollectorImage = await uploadImage(item.coletorFile);

          if (!uploadedCollectorImage?.[0]?.id) {
            throw new Error(
              `Não foi possível fazer o upload da foto do coletor no item ${
                index + 1
              }.`,
            );
          }
        }

        payloadItems.push({
          waste: Number(item.waste),
          weight_kg: roundedWeightInKg,
          original_quantity: originalQuantity,
          original_unit: item.original_unit,
          colector: uploadedCollectorImage?.[0]?.id || null,
          collector_volume_breakdown:
            item.original_unit === "L"
              ? item.collector_volume_breakdown || {
                  total_liters: originalQuantity,
                }
              : null,
        });
      }

      const cooperatives = await getCooperatives();

      const cooperative = cooperatives.data.find(
        (cooperative: any) =>
          cooperative.user?.username === currentUser?.username,
      );

      if (!cooperative?.id) {
        alert("Não foi possível identificar a cooperativa do usuário.");
        setLoading(false);
        return;
      }

      const selectedPev = pevs.find(
        (pev: any) => String(pev.id) === String(collectionPoint),
      );

      let responseAvariaImage = null;

      if (selectedValue === "yes") {
        if (!avariaFile) {
          throw new Error("Adicione a foto da avaria geral da coleta.");
        }

        responseAvariaImage = await uploadImage(avariaFile);

        if (!responseAvariaImage?.[0]?.id) {
          throw new Error("Não foi possível fazer o upload da foto da avaria.");
        }
      }
      const formatData = {
        cooperative: cooperative.id,
        client: Number(collectionPoint),
        client_id: selectedPev?.documentId || String(collectionPoint),
        latitude: location?.latitude?.toString() || null,
        longitude: location?.longitude?.toString() || null,
        collection_date: new Date().toISOString(),
        breakdown: responseAvariaImage?.[0]?.id || null,
        justification: null,
        items: payloadItems,
      };

      const idsSalvos = localStorage.getItem("ids")
        ? JSON.parse(localStorage.getItem("ids") || "[]")
        : [];

      idsSalvos.push(collectionPoint);
      localStorage.setItem("ids", JSON.stringify(idsSalvos));

      const response = await createCollectionWithItems(formatData);

      if (response) {
        setLoading(false);
        alert("Coleta registrada com sucesso!");
        window.location.reload();
      }

      return response;
    } catch (error: any) {
      console.error(error);
      alert(error?.message || "Falha ao registrar coleta.");
      setLoading(false);
    }
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
                      ),
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

          <div
            style={{ display: "flex", flexDirection: "column", gap: "16px" }}
          >
            <Typography
              style={{
                fontSize: "18px",
                fontWeight: 700,
                color: "#14532D",
                marginTop: "8px",
              }}
            >
              Resíduos desta coleta
            </Typography>

            {collectionItems.map((item, index) => {
              const totalLiters = calculateTotalLiters(
                item.collector_volume_breakdown ||
                  createEmptyCollectorVolumeCounts(),
              );

              return (
                <div
                  key={item.id}
                  style={{
                    padding: "14px",
                    border: "1px solid #D8E6D8",
                    borderRadius: "12px",
                    backgroundColor: "rgba(21, 133, 59, 0.04)",
                    display: "flex",
                    flexDirection: "column",
                    gap: "14px",
                    maxWidth: "560px",
                  }}
                >
                  <div
                    style={{
                      display: "flex",
                      justifyContent: "space-between",
                      alignItems: "center",
                      gap: "12px",
                    }}
                  >
                    <Typography style={{ fontWeight: 700, color: "#2E2222" }}>
                      Item {index + 1}
                    </Typography>

                    {collectionItems.length > 1 && (
                      <IconButton onClick={() => removeCollectionItem(item.id)}>
                        <DeleteIcon />
                      </IconButton>
                    )}
                  </div>

                  <FormControl fullWidth sx={{ maxWidth: "350px" }}>
                    <InputLabel id={`waste-${item.id}`}>
                      Tipo de resíduo
                    </InputLabel>
                    <Select
                      labelId={`waste-${item.id}`}
                      label="Tipo de resíduo"
                      value={item.waste}
                      onChange={(event) =>
                        updateCollectionItem(
                          item.id,
                          "waste",
                          String(event.target.value),
                        )
                      }
                    >
                      {wasteOptions.map((waste) => (
                        <MenuItem key={waste.id} value={waste.id}>
                          {waste.name}
                        </MenuItem>
                      ))}
                    </Select>
                  </FormControl>

                  <div
                    style={{
                      display: "flex",
                      gap: "16px",
                      alignItems: "flex-start",
                      flexWrap: "wrap",
                    }}
                  >
                    <TextField
                      value={item.original_quantity}
                      onChange={(event) =>
                        updateCollectionItem(
                          item.id,
                          "original_quantity",
                          event.target.value,
                        )
                      }
                      id={`quantity-${item.id}`}
                      placeholder="Digite a quantidade"
                      label="Quantidade"
                      variant="outlined"
                      autoComplete="off"
                      sx={{ maxWidth: "350px", width: "100%" }}
                    />

                    <FormControl>
                      <RadioGroup
                        row
                        value={item.original_unit}
                        onChange={(event) =>
                          updateCollectionItem(
                            item.id,
                            "original_unit",
                            event.target.value as "kg" | "L",
                          )
                        }
                      >
                        <FormControlLabel
                          value="kg"
                          control={<Radio />}
                          label="Kg"
                        />
                        <FormControlLabel
                          value="L"
                          control={<Radio />}
                          label="Litros"
                        />
                      </RadioGroup>
                    </FormControl>
                  </div>

                  {item.original_unit === "L" && (
                    <div
                      style={{
                        width: "100%",
                        maxWidth: "520px",
                        padding: "14px",
                        border: "1px solid #D8E6D8",
                        borderRadius: "10px",
                        backgroundColor: "rgba(21, 133, 59, 0.06)",
                      }}
                    >
                      <Typography
                        style={{
                          fontSize: "15px",
                          fontWeight: 700,
                          color: "#14532D",
                          marginBottom: "4px",
                        }}
                      >
                        Coletores cheios
                      </Typography>

                      <Typography
                        style={{
                          fontSize: "13px",
                          color: "#4B3838",
                          marginBottom: "10px",
                        }}
                      >
                        Toque para calcular o volume em litros deste resíduo.
                      </Typography>

                      <Button
                        type="button"
                        variant="outlined"
                        disabled={!item.waste}
                        onClick={() => openCollectorModalForItem(item.id)}
                        style={{
                          borderColor: "#15853B",
                          color: "#15853B",
                          textTransform: "none",
                          fontWeight: 700,
                        }}
                      >
                        Selecionar coletores
                      </Button>

                      {totalLiters > 0 && (
                        <Typography
                          style={{
                            fontSize: "16px",
                            fontWeight: 800,
                            color: "#14532D",
                            marginTop: "10px",
                          }}
                        >
                          Total: {totalLiters.toLocaleString("pt-BR")} L
                        </Typography>
                      )}

                      {!item.waste && (
                        <Typography
                          style={{
                            fontSize: "12px",
                            color: "#B45309",
                            marginTop: "10px",
                          }}
                        >
                          Selecione o tipo de resíduo antes de calcular por
                          coletores.
                        </Typography>
                      )}
                    </div>
                  )}

                  <div>
                    <Typography
                      style={{
                        fontSize: "14px",
                        fontWeight: "600",
                        marginBottom: "10px",
                        color: "#2E2222",
                      }}
                    >
                      Foto do coletor deste resíduo
                    </Typography>

                    {item.coletorImage ? (
                      <>
                        <StyledImage
                          src={item.coletorImage}
                          alt="Preview do coletor"
                        />

                        <div
                          style={{
                            display: "flex",
                            flexDirection: "row",
                            backgroundColor: "rgba(21, 133, 59, 0.08)",
                            padding: "8px",
                            borderRadius: "8px",
                            marginTop: "10px",
                            justifyContent: "space-between",
                            alignItems: "center",
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
                            <ImageIcon style={{ color: "#9B9794" }} />

                            <Typography
                              style={{
                                fontSize: "14px",
                                color: "#4B3838",
                              }}
                            >
                              Imagem do coletor selecionada
                            </Typography>
                          </div>

                          <IconButton
                            onClick={() => handleClearItemImage(item.id)}
                            size="medium"
                          >
                            <DeleteIcon style={{ color: "#9B9794" }} />
                          </IconButton>
                        </div>
                      </>
                    ) : (
                      <StyledImagePlaceholder
                        onClick={() =>
                          document
                            .getElementById(`image-upload-coletor-${item.id}`)
                            ?.click()
                        }
                      >
                        <div
                          style={{ display: "flex", flexDirection: "column" }}
                        >
                          <AddAPhotoIcon
                            style={{
                              fontSize: 36,
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
                      id={`image-upload-coletor-${item.id}`}
                      name={`image-upload-coletor-${item.id}`}
                      onChange={(event) => handleItemFileChange(item.id, event)}
                      accept="image/*"
                      capture="environment"
                      style={{ display: "none" }}
                    />
                  </div>
                </div>
              );
            })}

            <Button
              type="button"
              variant="outlined"
              onClick={addCollectionItem}
              style={{
                maxWidth: "260px",
                borderColor: "#15853B",
                color: "#15853B",
                textTransform: "none",
                fontWeight: 700,
              }}
            >
              Adicionar outro resíduo
            </Button>
          </div>
        </div>

        <div style={{ marginTop: "20px", maxWidth: "560px" }}>
          <div
            style={{
              display: "flex",
              alignItems: "center",
              justifyContent: "start",
              marginBottom: "14px",
            }}
          >
            <Leaf />

            <Typography
              style={{
                marginLeft: "10px",
                fontSize: "20px",
                fontWeight: "500",
              }}
            >
              Avaria geral da coleta
            </Typography>
          </div>

          <div
            style={{
              padding: "14px",
              border: "1px solid #D8E6D8",
              borderRadius: "12px",
              backgroundColor: "rgba(21, 133, 59, 0.04)",
              display: "flex",
              flexDirection: "column",
              gap: "14px",
            }}
          >
            <Typography
              style={{
                fontSize: "14px",
                fontWeight: 600,
                color: "#2E2222",
              }}
            >
              A coleta possui alguma avaria ou problema no coletor/PEV?
            </Typography>

            <RadioGroup row value={selectedValue} onChange={handleChangeRadio}>
              <FormControlLabel value="no" control={<Radio />} label="Não" />
              <FormControlLabel value="yes" control={<Radio />} label="Sim" />
            </RadioGroup>

            {selectedValue === "yes" && (
              <div>
                <Typography
                  style={{
                    fontSize: "14px",
                    fontWeight: "600",
                    marginBottom: "10px",
                    color: "#2E2222",
                  }}
                >
                  Foto da avaria
                </Typography>

                {avariaImage ? (
                  <>
                    <StyledImage src={avariaImage} alt="Preview da avaria" />

                    <div
                      style={{
                        display: "flex",
                        flexDirection: "row",
                        backgroundColor: "rgba(21, 133, 59, 0.08)",
                        padding: "8px",
                        borderRadius: "8px",
                        marginTop: "10px",
                        justifyContent: "space-between",
                        alignItems: "center",
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
                        <ImageIcon style={{ color: "#9B9794" }} />

                        <Typography
                          style={{
                            fontSize: "14px",
                            color: "#4B3838",
                          }}
                        >
                          Imagem da avaria selecionada
                        </Typography>
                      </div>

                      <IconButton
                        onClick={handleClearAvariaImage}
                        size="medium"
                      >
                        <DeleteIcon style={{ color: "#9B9794" }} />
                      </IconButton>
                    </div>
                  </>
                ) : (
                  <StyledImagePlaceholder
                    onClick={() =>
                      document.getElementById("image-upload-avaria")?.click()
                    }
                  >
                    <div style={{ display: "flex", flexDirection: "column" }}>
                      <AddAPhotoIcon
                        style={{
                          fontSize: 36,
                          color: "rgb(0, 0, 0, 0.35)",
                          alignSelf: "center",
                          marginBottom: "10px",
                        }}
                      />

                      <Typography
                        variant="body1"
                        style={{ color: "#4B3838", textAlign: "center" }}
                      >
                        Toque para inserir foto da <strong>avaria</strong>
                      </Typography>
                    </div>
                  </StyledImagePlaceholder>
                )}

                <input
                  type="file"
                  id="image-upload-avaria"
                  name="image-upload-avaria"
                  onChange={handleAvariaFileChange}
                  accept="image/*"
                  capture="environment"
                  style={{ display: "none" }}
                />
              </div>
            )}
          </div>
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

        <CollectorVolumeModal
          open={collectorModalOpen}
          initialCounts={activeCollectorCounts}
          onClose={() => {
            setCollectorModalOpen(false);
            setActiveCollectorItemId(null);
          }}
          onConfirm={handleConfirmCollectorVolume}
        />
      </form>
    </div>
  );
}
