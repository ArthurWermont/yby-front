import AddIcon from "@mui/icons-material/Add";
import CloseIcon from "@mui/icons-material/Close";
import DeleteOutlineIcon from "@mui/icons-material/DeleteOutline";
import RemoveIcon from "@mui/icons-material/Remove";
import {
  Box,
  Button,
  Divider,
  IconButton,
  Modal,
  Typography,
} from "@mui/material";
import { useEffect, useMemo, useState } from "react";

import {
  calculateTotalLiters,
  collectorVolumeOptions,
  createEmptyCollectorVolumeCounts,
  type CollectorVolumeCounts,
} from "../constants/collectorVolumes";

type CollectorVolumeModalProps = {
  open: boolean;
  initialCounts: CollectorVolumeCounts;
  onClose: () => void;
  onConfirm: (counts: CollectorVolumeCounts) => void;
};

const modalStyle = {
  position: "absolute" as const,
  top: "50%",
  left: "50%",
  transform: "translate(-50%, -50%)",
  width: "min(92vw, 560px)",
  maxHeight: "88vh",
  overflowY: "auto" as const,
  bgcolor: "#FFFFFF",
  borderRadius: "16px",
  boxShadow: "0px 18px 50px rgba(0,0,0,0.25)",
  outline: "none",
};

const formatLiters = (value: number) => {
  return value.toLocaleString("pt-BR");
};

export function CollectorVolumeModal({
  open,
  initialCounts,
  onClose,
  onConfirm,
}: CollectorVolumeModalProps) {
  const [counts, setCounts] = useState<CollectorVolumeCounts>(
    createEmptyCollectorVolumeCounts(),
  );

  useEffect(() => {
    if (open) {
      setCounts(initialCounts || createEmptyCollectorVolumeCounts());
    }
  }, [open, initialCounts]);

  const totalLiters = useMemo(() => calculateTotalLiters(counts), [counts]);

  const handleIncrement = (id: string) => {
    setCounts((prev) => ({
      ...prev,
      [id]: (prev[id] || 0) + 1,
    }));
  };

  const handleDecrement = (id: string) => {
    setCounts((prev) => ({
      ...prev,
      [id]: Math.max((prev[id] || 0) - 1, 0),
    }));
  };

  const handleClear = () => {
    setCounts(createEmptyCollectorVolumeCounts());
  };

  const handleConfirm = () => {
    if (totalLiters <= 0) return;
    onConfirm(counts);
  };

  return (
    <Modal open={open} onClose={onClose}>
      <Box sx={modalStyle}>
        <Box
          sx={{
            px: 2.4,
            py: 2,
            display: "flex",
            alignItems: "flex-start",
            justifyContent: "space-between",
            gap: 2,
          }}
        >
          <Box>
            <Typography
              sx={{
                fontSize: 20,
                fontWeight: 700,
                color: "#14532D",
                lineHeight: 1.2,
              }}
            >
              Selecionar coletores cheios
            </Typography>

            <Typography
              sx={{
                mt: 0.8,
                fontSize: 13,
                color: "#6D5C5C",
                lineHeight: 1.4,
              }}
            >
              Informe quantos coletores cheios existem nesta coleta. O sistema
              calculará automaticamente o total em litros.
            </Typography>
          </Box>

          <IconButton onClick={onClose} size="small">
            <CloseIcon />
          </IconButton>
        </Box>

        <Divider />

        <Box
          sx={{
            px: 2.4,
            py: 2,
            display: "flex",
            flexDirection: "column",
            gap: 1.4,
          }}
        >
          {collectorVolumeOptions.map((option) => {
            const count = counts[option.id] || 0;
            const subtotal = count * option.liters;

            return (
              <Box
                key={option.id}
                sx={{
                  display: "grid",
                  gridTemplateColumns: "72px 1fr auto",
                  gap: 1.5,
                  alignItems: "center",
                  p: 1.4,
                  border: "1px solid #D8E6D8",
                  borderRadius: "14px",
                  backgroundColor: count > 0 ? "#F0F8F1" : "#FFFFFF",
                }}
              >
                <Box
                  sx={{
                    width: 64,
                    height: 64,
                    borderRadius: "12px",
                    backgroundColor: "#E8F3EA",
                    border: "1px solid #CFE4D2",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    overflow: "hidden",
                  }}
                >
                  {option.image ? (
                    <Box
                      component="img"
                      src={option.image}
                      alt={option.label}
                      onError={(event) => {
                        event.currentTarget.style.display = "none";
                      }}
                      sx={{
                        width: "100%",
                        height: "100%",
                        objectFit: "contain",
                      }}
                    />
                  ) : null}

                  <Typography
                    sx={{
                      fontSize: 16,
                      fontWeight: 800,
                      color: "#15853B",
                    }}
                  >
                    {option.label}
                  </Typography>
                </Box>

                <Box>
                  <Typography
                    sx={{
                      fontSize: 15,
                      fontWeight: 700,
                      color: "#2E2222",
                    }}
                  >
                    Coletor de {option.label}
                  </Typography>

                  <Typography
                    sx={{
                      mt: 0.3,
                      fontSize: 12,
                      color: "#6D5C5C",
                    }}
                  >
                    {option.description}
                  </Typography>

                  {count > 0 && (
                    <Typography
                      sx={{
                        mt: 0.5,
                        fontSize: 12,
                        fontWeight: 700,
                        color: "#14532D",
                      }}
                    >
                      Subtotal: {formatLiters(subtotal)} L
                    </Typography>
                  )}
                </Box>

                <Box
                  sx={{
                    display: "flex",
                    alignItems: "center",
                    gap: 0.6,
                  }}
                >
                  <IconButton
                    onClick={() => handleDecrement(option.id)}
                    disabled={count === 0}
                    size="small"
                    sx={{
                      border: "1px solid #D8E6D8",
                      color: "#14532D",
                    }}
                  >
                    <RemoveIcon fontSize="small" />
                  </IconButton>

                  <Typography
                    sx={{
                      width: 28,
                      textAlign: "center",
                      fontSize: 17,
                      fontWeight: 800,
                      color: "#2E2222",
                    }}
                  >
                    {count}
                  </Typography>

                  <IconButton
                    onClick={() => handleIncrement(option.id)}
                    size="small"
                    sx={{
                      border: "1px solid #15853B",
                      color: "#15853B",
                    }}
                  >
                    <AddIcon fontSize="small" />
                  </IconButton>
                </Box>
              </Box>
            );
          })}
        </Box>

        <Box
          sx={{
            px: 2.4,
            py: 1.8,
            backgroundColor: "#F8F3E9",
            borderTop: "1px solid #E4D8CA",
          }}
        >
          <Box
            sx={{
              display: "flex",
              alignItems: "baseline",
              justifyContent: "space-between",
              gap: 2,
              mb: 1.6,
            }}
          >
            <Typography
              sx={{
                fontSize: 14,
                fontWeight: 700,
                color: "#4B3838",
              }}
            >
              Total estimado
            </Typography>

            <Typography
              sx={{
                fontSize: 26,
                fontWeight: 800,
                color: "#14532D",
              }}
            >
              {formatLiters(totalLiters)} L
            </Typography>
          </Box>

          <Box
            sx={{
              display: "flex",
              gap: 1,
              justifyContent: "space-between",
              flexWrap: "wrap",
            }}
          >
            <Button
              type="button"
              variant="text"
              startIcon={<DeleteOutlineIcon />}
              onClick={handleClear}
              disabled={totalLiters === 0}
              sx={{
                color: "#6D5C5C",
                textTransform: "none",
                fontWeight: 600,
              }}
            >
              Limpar
            </Button>

            <Box sx={{ display: "flex", gap: 1 }}>
              <Button
                type="button"
                variant="outlined"
                onClick={onClose}
                sx={{
                  borderColor: "#CDBBA7",
                  color: "#4B3838",
                  textTransform: "none",
                  fontWeight: 600,
                }}
              >
                Cancelar
              </Button>

              <Button
                type="button"
                variant="contained"
                onClick={handleConfirm}
                disabled={totalLiters <= 0}
                sx={{
                  backgroundColor: "#15853B",
                  textTransform: "none",
                  fontWeight: 700,
                  "&:hover": {
                    backgroundColor: "#116C31",
                  },
                }}
              >
                Usar este total
              </Button>
            </Box>
          </Box>
        </Box>
      </Box>
    </Modal>
  );
}
