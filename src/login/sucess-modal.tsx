import Dialog from "@mui/material/Dialog";
import DialogContent from "@mui/material/DialogContent";
import Button from "@mui/material/Button";
import Typography from "@mui/material/Typography";
import CheckCircleIcon from "@mui/icons-material/CheckCircle";
import { Box, useTheme } from "@mui/material"; // Importações aprimoradas

// 1. Definição das Props (Tipagem Profissional)
interface SuccessModalProps {
  open: boolean;
  onNavigate: () => void; // A função que fecha e navega
}

export default function SuccessModal({ open, onNavigate }: SuccessModalProps) {
  const theme = useTheme();

  return (
    // 2. Ajuste do Dialog: 'onClose' chama a função de navegação para fechar e ir.
    <Dialog
      open={open}
      onClose={onNavigate}
      aria-labelledby="success-dialog-title"
      // Define a largura máxima para dar um visual mais compacto e centralizado
      maxWidth="xs"
      fullWidth
      sx={{ "& .MuiDialog-paper": { borderRadius: theme.spacing(2) } }} // Borda arredondada
    >
      <DialogContent sx={{ p: theme.spacing(4) }}>
        {/* Container para o Ícone e Título, garantindo centralização e espaçamento */}
        <Box
          sx={{
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            textAlign: "center",
          }}
        >
          {/* Ícone de Sucesso Maior e com Margem Inferior */}
          <CheckCircleIcon
            color="success"
            sx={{
              fontSize: 60,
              mb: theme.spacing(2),
            }}
          />

          {/* Título Mais Forte e Contextual */}
          <Typography
            variant="h5" // H5 é mais impactante para título de Modal
            component="h2"
            id="success-dialog-title"
            gutterBottom // Adiciona margem inferior padrão
          >
            Recuperação Enviada!
          </Typography>

          {/* Mensagem Principal */}
          <Typography
            variant="body1"
            color="text.secondary"
            sx={{ mt: theme.spacing(1), mb: theme.spacing(3) }}
          >
            {"Enviamos um link de recuperação para seu e-mail!"}
          </Typography>

          {/* Botão de Ação */}
          <Button
            onClick={onNavigate}
            color="primary"
            variant="contained"
            autoFocus // Foco automático para acessibilidade
            size="large" // Botão maior para ser o CTA principal
            fullWidth
          >
            Ir para a tela de Login
          </Button>
        </Box>
      </DialogContent>
      {/* Remove o DialogActions, pois o botão está dentro do DialogContent, deixando o design mais limpo */}
    </Dialog>
  );
}
