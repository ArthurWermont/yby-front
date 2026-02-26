import { useState } from "react";
import {
  TextField,
  Button,
  CircularProgress,
  Typography,
  Divider,
  Box,
} from "@mui/material";
import { styled as styledComponents } from "styled-components";
import YbyLogo from "../assets/yby-logo";
import * as yup from "yup";
import api from "../api/api";
import { useSearchParams } from "react-router-dom";
import { useNavigate } from "react-router-dom";

const Container = styledComponents.div`
  display: flex;
  flex-direction: column;
  background-color: rgba(221, 195, 147, 0.2);
  min-height: 100vh;
  width: 100%;
  justify-content: center;
  align-items: center;
`;

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

const resetPasswordSchema = yup.object().shape({
  password: yup
    .string()
    .required("Senha de acesso é obrigatória.")
    .min(6, "Senha deve ter pelo menos 6 dígitos."),
  confirmPassword: yup
    .string()
    .required("Confirmação de senha é obrigatória.")
    .oneOf([yup.ref("password")], "As senhas não coincidem."),
});

export default function ResetPassword() {
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [messages, setMessages] = useState<string[]>([]);
  const [isSuccess, setIsSuccess] = useState<boolean | null>(null);
  const [searchParams] = useSearchParams(); // ✅ lê o código da URL
  const navigate = useNavigate();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setMessages([]);
    setIsSuccess(null);

    try {
      await resetPasswordSchema.validate(
        { password, confirmPassword },
        { abortEarly: false }
      );

      const code = searchParams.get("code"); //le o codigo enviado pelo email
      if (!code) throw new Error("Código de redefinição ausente.");

      await api.post("/users-permissions/reset-password", {
        code,
        password,
        passwordConfirmation: confirmPassword,
      });
      const successMsg =
        "Sua senha foi redefinida com sucesso! Faça login com a nova senha.";

      // setMessages(["Senha redefinida com sucesso!"]);
      setIsSuccess(true);

      navigate("/signIn", {
        state: { successMessage: successMsg },
      });
    } catch (err: any) {
      if (err.name === "ValidationError") {
        setMessages([err.errors[0]]);
        setIsSuccess(false);
      } else {
        setMessages(["Erro inesperado ao redefinir senha."]);
        setIsSuccess(false);
      }
    } finally {
      setLoading(false);
    }
  };

  // 🔹 Limpa mensagens quando o usuário começa a digitar novamente
  const handleChange =
    (setter: any) => (e: React.ChangeEvent<HTMLInputElement>) => {
      setter(e.target.value);
      if (messages.length > 0) {
        setMessages([]);
        setIsSuccess(null);
      }
    };

  return (
    <Container>
      <Card>
        <YbyLogo
          style={{
            width: "180px",
            maxWidth: "200px",
            height: "auto",
            margin: "0 auto 16px auto",
          }}
        />

        <Typography
          fontSize={20}
          style={{ marginBottom: "6px", textAlign: "center", fontWeight: 600 }}
        >
          Redefinir senha
        </Typography>
        <Divider />

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
            type="password"
            label="Nova senha"
            value={password}
            onChange={handleChange(setPassword)}
            required
            fullWidth
            size="small"
          />
          <TextField
            type="password"
            label="Confirmar senha"
            value={confirmPassword}
            onChange={handleChange(setConfirmPassword)}
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
              "Redefinir senha"
            )}
          </Button>
        </form>

        {messages.length > 0 && (
          <Box mt={2} textAlign="center">
            {messages.map((msg, index) => (
              <Typography
                key={index}
                style={{
                  color: isSuccess ? "green" : "red",
                  fontSize: "14px",
                  marginBottom: "4px",
                }}
              >
                {msg}
              </Typography>
            ))}
          </Box>
        )}
      </Card>
    </Container>
  );
}
