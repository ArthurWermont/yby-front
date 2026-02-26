import { useState } from "react";
import {
  TextField,
  Button,
  CircularProgress,
  Typography,
  Divider,
} from "@mui/material";
import { styled as styledComponents } from "styled-components";
import YbyLogo from "../assets/yby-logo"; // aproveitando o mesmo logo do login
import api from "../api/api";
import { useNavigate } from "react-router-dom";
import SuccessModal from "./sucess-modal";

// Container com o fundo bege da aplicação
const ForgotPasswordContainer = styledComponents.div`
  display: flex;
  flex-direction: column;
  background-color: rgba(221, 195, 147, 0.2);
  min-height: 100vh;
  width: 100%;
  justify-content: center;
  align-items: center;
`;

// Card centralizado, igual ao login
const Card = styledComponents.div`
  display: flex;
  flex-direction: column;
  width: 30%;
  max-width: 500px;
  min-width: 320px;
  margin: auto;
  box-shadow: hsla(220, 30%, 5%, 0.05) 0px 5px 15px 0px,
    hsla(220, 25%, 10%, 0.05) 0px 15px 35px -5px;
  padding: 30px 24px;
  background-color: white;
  border-radius: 20px;
`;

export default function ForgotPassword() {
  const [email, setEmail] = useState("");
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState("");
  const navigate = useNavigate();
  const [openModal, setOpenModal] = useState(false);

  const handleCloseAndNavigate = () => {
    setOpenModal(false); // Fecha o modal
    navigate("/signIn"); // Navega
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      const response = await api.post("/users-permissions/forgot-password", {
        email: email,
      });

      if (response.status === 200) {
        setOpenModal(true);
      } else {
        setMessage("Algo deu errado. Tente novamente.");
      }
    } catch (err: any) {
      console.error(err);
      if (err.response?.status === 400) {
        setMessage("E-mail não encontrado.");
      } else {
        setMessage("Erro inesperado ao enviar o e-mail.");
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <ForgotPasswordContainer>
      <Card>
        {/* Logo */}
        <YbyLogo
          style={{
            width: "180px",
            maxWidth: "200px",
            height: "auto",
            margin: "0 auto 16px auto",
          }}
        />

        {/* Título */}
        <Typography
          fontSize={20}
          style={{ marginBottom: "6px", textAlign: "center", fontWeight: 600 }}
        >
          Recuperar senha
        </Typography>
        <Divider />

        {/* Form */}
        <form
          onSubmit={handleSubmit}
          style={{
            display: "flex",
            flexDirection: "column",
            gap: "16px",
            marginTop: "28px",
          }}
        >
          <TextField
            type="email"
            label="Digite seu e-mail"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
            fullWidth
            size="small"
          />
          <Button
            fullWidth
            variant="contained"
            type="submit"
            disabled={loading}
            style={{
              backgroundColor: "#15853B",
              color: "white",
              textTransform: "none",
              fontWeight: 500,
            }}
          >
            {loading ? (
              <CircularProgress size={20} color="inherit" />
            ) : (
              "Enviar link de recuperação"
            )}
          </Button>
        </form>

        {/* Mensagem de feedback */}
        {message && (
          <Typography
            style={{
              marginTop: "12px",
              color: message.startsWith("Erro") ? "red" : "",
              textAlign: "center",
              fontSize: "14px",
            }}
          >
            {message}
          </Typography>
        )}
        <SuccessModal
          open={openModal}
          onNavigate={handleCloseAndNavigate} // A função que fecha e navega
        />
      </Card>
    </ForgotPasswordContainer>
  );
}
