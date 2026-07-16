import CloseIcon from "@mui/icons-material/Close";
import ImageIcon from "@mui/icons-material/Image";
import { Box, Chip, Divider, IconButton, Typography } from "@mui/material";
import Modal from "@mui/material/Modal";

const ModalImageComponent = ({
  open,
  handleClose,
  images,
  cooperative,
  date,
}: any) => {
  const itemImages = images?.itemImages || [];
  const hasItemImages = Array.isArray(itemImages) && itemImages.length > 0;

  const fallbackCollectorImage =
    images?.imageColectorUrl || images?.imageColector || "";

  const itemsWithImage = itemImages.filter((item: any) => item.imageColector);
  const totalItems = itemImages.length;
  const totalImages = itemsWithImage.length;
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
          width: 860,
          maxWidth: "94vw",
          maxHeight: "90vh",
          overflow: "hidden",
          bgcolor: "#FFFFFF",
          boxShadow: "0 24px 70px rgba(0,0,0,0.22)",
          borderRadius: "18px",
          display: "flex",
          flexDirection: "column",
        }}
      >
        <Box
          sx={{
            px: 3,
            py: 2.5,
            borderBottom: "1px solid #E8EFE8",
            display: "flex",
            justifyContent: "space-between",
            alignItems: "flex-start",
            gap: 2,
          }}
        >
          <Box>
            <Typography
              id="modal-modal-title"
              sx={{
                fontSize: "22px",
                fontWeight: 700,
                color: "#1F2A1F",
                lineHeight: 1.2,
              }}
            >
              Registro fotográfico da coleta
            </Typography>

            <Typography
              sx={{
                mt: 0.6,
                fontSize: "14px",
                color: "#6B7280",
              }}
            >
              Evidências visuais vinculadas aos resíduos coletados neste PEV.
            </Typography>

            <Box
              sx={{
                mt: 1.4,
                display: "grid",
                gridTemplateColumns: {
                  xs: "1fr",
                  sm: "1fr 1fr",
                },
                gap: 1,
              }}
            >
              <Box
                sx={{
                  backgroundColor: "#F4F8F4",
                  border: "1px solid #E3ECE4",
                  borderRadius: "10px",
                  px: 1.4,
                  py: 1,
                }}
              >
                <Typography
                  sx={{
                    fontSize: "11px",
                    fontWeight: 800,
                    color: "#6B7280",
                    textTransform: "uppercase",
                    letterSpacing: "0.04em",
                  }}
                >
                  Registrado por
                </Typography>

                <Typography
                  sx={{
                    fontSize: "14px",
                    fontWeight: 700,
                    color: "#1F2A1F",
                    mt: 0.2,
                  }}
                >
                  {cooperative || "Não informado"}
                </Typography>
              </Box>

              <Box
                sx={{
                  backgroundColor: "#F4F8F4",
                  border: "1px solid #E3ECE4",
                  borderRadius: "10px",
                  px: 1.4,
                  py: 1,
                }}
              >
                <Typography
                  sx={{
                    fontSize: "11px",
                    fontWeight: 800,
                    color: "#6B7280",
                    textTransform: "uppercase",
                    letterSpacing: "0.04em",
                  }}
                >
                  Capturado(s) em
                </Typography>

                <Typography
                  sx={{
                    fontSize: "14px",
                    fontWeight: 700,
                    color: "#1F2A1F",
                    mt: 0.2,
                  }}
                >
                  {date || "Não informado"}
                </Typography>
              </Box>
            </Box>

            {hasItemImages && (
              <Box
                sx={{
                  display: "flex",
                  gap: 1,
                  flexWrap: "wrap",
                  mt: 1.5,
                }}
              >
                <Chip
                  label={`${totalItems} item${totalItems > 1 ? "s" : ""} da coleta`}
                  size="small"
                  sx={{
                    backgroundColor: "#EEF8F0",
                    color: "#15853B",
                    fontWeight: 600,
                  }}
                />

                <Chip
                  label={`${totalImages} foto${totalImages !== 1 ? "s" : ""} vinculada${totalImages !== 1 ? "s" : ""}`}
                  size="small"
                  sx={{
                    backgroundColor: "#F4F8F4",
                    color: "#4B5563",
                    fontWeight: 600,
                  }}
                />
              </Box>
            )}
          </Box>

          <IconButton
            onClick={handleClose}
            size="medium"
            sx={{
              color: "#6B7280",
              backgroundColor: "#F7F7F7",
              "&:hover": {
                backgroundColor: "#EFEFEF",
              },
            }}
          >
            <CloseIcon />
          </IconButton>
        </Box>

        <Box
          sx={{
            flex: 1,
            overflowY: "auto",
            px: 3,
            py: 2.5,
            backgroundColor: "#FBFCFB",
          }}
        >
          <Typography
            sx={{
              fontSize: "13px",
              fontWeight: 800,
              color: "#374151",
              letterSpacing: "0.05em",
              textTransform: "uppercase",
              mb: 1.5,
            }}
          >
            Coletores por item
          </Typography>

          {hasItemImages ? (
            <Box
              sx={{
                display: "grid",
                gridTemplateColumns: {
                  xs: "1fr",
                  sm: "1fr",
                  md: "1fr 1fr",
                },
                gap: 2,
              }}
            >
              {itemImages.map((item: any, index: number) => {
                const hasImage = Boolean(item.imageColector);

                return (
                  <Box
                    key={`${item.order || index}-${item.wasteName}`}
                    sx={{
                      backgroundColor: "#FFFFFF",
                      border: hasImage
                        ? "1px solid #BFE3C8"
                        : "1px dashed #D6D6D6",
                      borderRadius: "14px",
                      overflow: "hidden",
                      boxShadow: "0 8px 24px rgba(21, 133, 59, 0.06)",
                    }}
                  >
                    <Box
                      sx={{
                        px: 2,
                        py: 1.5,
                        borderBottom: "1px solid #EEF2EE",
                        display: "flex",
                        justifyContent: "space-between",
                        alignItems: "flex-start",
                        gap: 1,
                      }}
                    >
                      <Box>
                        <Typography
                          sx={{
                            fontSize: "15px",
                            fontWeight: 800,
                            color: "#1F2A1F",
                          }}
                        >
                          Item {item.order || index + 1} —{" "}
                          {item.wasteName || "Resíduo"}
                        </Typography>

                        <Typography
                          sx={{
                            fontSize: "13px",
                            color: "#6B7280",
                            mt: 0.3,
                          }}
                        >
                          Peso:{" "}
                          <strong>
                            {Number(item.weightKg || 0).toLocaleString("pt-BR")}{" "}
                            kg
                          </strong>
                        </Typography>
                      </Box>

                      <Chip
                        label={hasImage ? "Com foto" : "Sem foto"}
                        size="small"
                        sx={{
                          backgroundColor: hasImage ? "#EEF8F0" : "#F5F5F5",
                          color: hasImage ? "#15853B" : "#9A9A9A",
                          fontWeight: 700,
                        }}
                      />
                    </Box>

                    <Box sx={{ p: 2 }}>
                      <Box
                        sx={{
                          display: "flex",
                          flexWrap: "wrap",
                          gap: 1,
                          mb: hasImage ? 1.5 : 0,
                        }}
                      >
                        <Chip
                          size="small"
                          label={`Quantidade original: ${
                            item.originalQuantity || "-"
                          } ${item.originalUnit || ""}`}
                          sx={{
                            backgroundColor: "#F7F7F7",
                            color: "#4B5563",
                          }}
                        />

                        {item.collectorVolumeBreakdown?.total_liters && (
                          <Chip
                            size="small"
                            label={`Total em litros: ${item.collectorVolumeBreakdown.total_liters} L`}
                            sx={{
                              backgroundColor: "#F7F7F7",
                              color: "#4B5563",
                            }}
                          />
                        )}
                      </Box>

                      {hasImage ? (
                        <Box
                          component="a"
                          href={item.imageColector}
                          target="_blank"
                          rel="noopener noreferrer"
                          sx={{
                            display: "block",
                            textDecoration: "none",
                          }}
                        >
                          <Box
                            component="img"
                            src={item.imageColector}
                            alt={`Imagem do coletor - ${item.wasteName}`}
                            sx={{
                              width: "100%",
                              height: 260,
                              objectFit: "cover",
                              borderRadius: "12px",
                              border: "1px solid #E5E7EB",
                              display: "block",
                              backgroundColor: "#F4F4F4",
                            }}
                          />

                          <Typography
                            sx={{
                              mt: 0.8,
                              fontSize: "12px",
                              color: "#15853B",
                              fontWeight: 600,
                            }}
                          >
                            Clique na imagem para visualizar em tamanho maior.
                          </Typography>
                        </Box>
                      ) : (
                        <Box
                          sx={{
                            height: 180,
                            borderRadius: "12px",
                            border: "1px dashed #D1D5DB",
                            backgroundColor: "#FAFAFA",
                            display: "flex",
                            flexDirection: "column",
                            justifyContent: "center",
                            alignItems: "center",
                            color: "#9CA3AF",
                            gap: 1,
                          }}
                        >
                          <ImageIcon />

                          <Typography
                            sx={{
                              fontSize: "13px",
                              color: "#9A9A9A",
                              textAlign: "center",
                            }}
                          >
                            Este item ainda não possui imagem do coletor.
                          </Typography>
                        </Box>
                      )}
                    </Box>
                  </Box>
                );
              })}
            </Box>
          ) : fallbackCollectorImage ? (
            <Box
              sx={{
                backgroundColor: "#FFFFFF",
                border: "1px solid #BFE3C8",
                borderRadius: "14px",
                p: 2,
                width: "fit-content",
                maxWidth: "100%",
              }}
            >
              <Typography
                sx={{
                  fontSize: "14px",
                  fontWeight: 700,
                  color: "#1F2A1F",
                  mb: 1,
                }}
              >
                Imagem do coletor
              </Typography>

              <Box
                component="img"
                src={fallbackCollectorImage}
                alt="Imagem do coletor"
                sx={{
                  width: 320,
                  maxWidth: "100%",
                  height: 320,
                  objectFit: "cover",
                  borderRadius: "12px",
                  border: "1px solid #E5E7EB",
                }}
              />
            </Box>
          ) : (
            <Box
              sx={{
                backgroundColor: "#FFFFFF",
                border: "1px dashed #D1D5DB",
                borderRadius: "14px",
                p: 3,
                textAlign: "center",
                color: "#9CA3AF",
              }}
            >
              <ImageIcon sx={{ mb: 1 }} />

              <Typography sx={{ fontSize: "14px" }}>
                Não há imagens de coletor vinculadas.
              </Typography>
            </Box>
          )}

          <Divider sx={{ my: 3 }} />

          <Typography
            sx={{
              fontSize: "13px",
              fontWeight: 800,
              color: "#374151",
              letterSpacing: "0.05em",
              textTransform: "uppercase",
              mb: 1.5,
            }}
          >
            Avaria geral
          </Typography>

          {images?.imageAvaria ? (
            <Box
              sx={{
                backgroundColor: "#FFFFFF",
                border: "1px solid #BFE3C8",
                borderRadius: "14px",
                p: 2,
                width: "fit-content",
                maxWidth: "100%",
              }}
            >
              <Box
                component="a"
                href={images.imageAvaria}
                target="_blank"
                rel="noopener noreferrer"
                sx={{ display: "block" }}
              >
                <Box
                  component="img"
                  src={images.imageAvaria}
                  alt="Imagem da avaria"
                  sx={{
                    width: 320,
                    maxWidth: "100%",
                    height: 320,
                    objectFit: "cover",
                    borderRadius: "12px",
                    border: "1px solid #E5E7EB",
                    display: "block",
                  }}
                />
              </Box>

              <Typography
                sx={{
                  mt: 0.8,
                  fontSize: "12px",
                  color: "#15853B",
                  fontWeight: 600,
                }}
              >
                Clique na imagem para visualizar em tamanho maior.
              </Typography>
            </Box>
          ) : (
            <Box
              sx={{
                backgroundColor: "#FFFFFF",
                border: "1px dashed #D1D5DB",
                borderRadius: "14px",
                p: 2,
                color: "#9CA3AF",
              }}
            >
              <Typography sx={{ fontSize: "14px" }}>
                Não há imagem de avaria vinculada.
              </Typography>
            </Box>
          )}
        </Box>
      </Box>
    </Modal>
  );
};

export default ModalImageComponent;
