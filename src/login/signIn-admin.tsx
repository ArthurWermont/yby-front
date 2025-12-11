import { CircularProgress, FormHelperText } from "@mui/material";
import Button from "@mui/material/Button";
import Divider from "@mui/material/Divider";
import FormControl from "@mui/material/FormControl";
import TextField from "@mui/material/TextField";
import Typography from "@mui/material/Typography";
import { useContext, useEffect, useState } from "react";
import { Controller, useForm } from "react-hook-form";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { styled as styledComponents } from "styled-components";
import { authAdmin } from "../api/auth";
import YbyLogo from "../assets/yby-logo";
import { AuthContext } from "../context/auth-context";

import { yupResolver } from "@hookform/resolvers/yup";
import * as yup from "yup";

// 3. Adicionar Imports do Snackbar
import Snackbar from "@mui/material/Snackbar";
import MuiAlert, { AlertProps } from "@mui/material/Alert";
import React from "react";

// Componente Alert customizado (Toast)
const Alert = React.forwardRef<HTMLDivElement, AlertProps>(function Alert(
  props,
  ref
) {
  return <MuiAlert elevation={6} ref={ref} variant="filled" {...props} />;
});

const Card = styledComponents.div`
  display: flex;
  flex-direction: column;
  align-self: center;
  width: 30%;
  max-width: 550px;
  min-width: 300px;
  margin: auto;
  box-shadow: hsla(220, 30%, 5%, 0.05) 0px 5px 15px 0px,
    hsla(220, 25%, 10%, 0.05) 0px 15px 35px -5px;
  
  padding: 20px;
  background-color: white;
  border-radius: 20px;


  overflow-x: hidden;
  overflow-y: hidden;
`;

const SignInContainer = styledComponents.div`
    display: flex;
    flex-direction: column;
    background-color: rgba(221, 195, 147, 0.2);
    min-height: 100vh;
    height: 100vh;
    width: 100%;
    overflow-x: hidden;
    overflow-y: hidden;
`;

const schema = yup.object().shape({
  adminIdentifier: yup.string().required("Email é obrigatório").email(),
  adminPassword: yup.string().required("Senha é obrigatória"),
});

export default function SignIn(props: { disableCustomTheme?: boolean }) {
  const navigate = useNavigate();
  const { login } = useContext(AuthContext);
  const location = useLocation(); // ⭐️ PARTE 1: Inicializa o useLocation
  const [snackbarOpen, setSnackbarOpen] = useState(false);
  const [snackbarMessage, setSnackbarMessage] = useState("");

  const [loading, setLoading] = useState(false);

  const { control, handleSubmit, setError } = useForm({
    defaultValues: {
      adminIdentifier: "",
      adminPassword: "",
    },
    resolver: yupResolver(schema),
  });

  const onSubmit = async (data: any) => {
    try {
      setLoading(true);

      const admin = await authAdmin({
        identifier: data.adminIdentifier,
        password: data.adminPassword,
      });

      const formattedAdmin = {
        jwt: admin.jwt,
        username: admin.user.username,
        documentId: admin.user.documentId,
        email: admin.user.email,
        isAdmin: admin.user.admin,
        id: admin.user.id,
        client_id: admin.user.client_id,
      };

      if (admin) {
        login(formattedAdmin);
        navigate("/ponto-coleta");
        setLoading(false);
      }
    } catch (error) {
      setLoading(false);

      setError("adminIdentifier", {
        type: "server",
        message: "Erro ao fazer login",
      });
      setError("adminPassword", {
        type: "server",
        message: "Erro ao fazer login",
      });
    }
  };

  // ⭐️ PARTE 3: Lógica para ler a mensagem do ResetPassword
  useEffect(() => {
    if (location.state && location.state.successMessage) {
      const msg = location.state.successMessage;

      setSnackbarMessage(msg);
      setSnackbarOpen(true);
    }
  }, [location.state]);

  // ⭐️ PARTE 4: Função para fechar o Snackbar
  const handleCloseSnackbar = (
    event?: React.SyntheticEvent | Event,
    reason?: string
  ) => {
    if (reason === "clickaway") {
      return;
    }
    setSnackbarOpen(false);
  };

  return (
    <SignInContainer>
      <Card>
        <YbyLogo
          style={{
            width: "200px",
            maxWidth: "200px",
            height: "auto",
            margin: "auto",
          }}
        />
        <Typography
          fontSize={20}
          style={{
            marginTop: "12px ",
            marginBottom: "6px",
            textAlign: "start",
          }}
        >
          Conecte-se à YBY
        </Typography>
        <Divider />

        <form
          onSubmit={handleSubmit(onSubmit)}
          style={{
            display: "flex",
            flexDirection: "column",
            width: "100%",
            gap: "16px",
            marginTop: "28px",
          }}
        >
          <Controller
            name={`adminIdentifier`}
            control={control}
            render={({ field, fieldState }) => (
              <FormControl>
                <TextField
                  {...field}
                  id="adminIdentifier"
                  type="text"
                  placeholder="Seu e-mail"
                  required
                  fullWidth
                  label="Endereço de e-mail"
                  variant="outlined"
                  size="small"
                  autoComplete="off"
                  error={fieldState.error ? true : false}
                />
                {fieldState.error && (
                  <FormHelperText style={{ color: "red" }}>
                    e-mail invalido
                  </FormHelperText>
                )}
              </FormControl>
            )}
          />

          <Controller
            name={`adminPassword`}
            control={control}
            render={({ field, fieldState }) => (
              <FormControl>
                <TextField
                  {...field}
                  id="adminPassword"
                  type="password"
                  placeholder="Sua senha"
                  required
                  fullWidth
                  label="Senha"
                  variant="outlined"
                  size="small"
                  autoComplete="off"
                  error={fieldState.error ? true : false}
                />
                {fieldState.error && (
                  <FormHelperText style={{ color: "red" }}>
                    senha invalida
                  </FormHelperText>
                )}
              </FormControl>
            )}
          />
          {/* <Link style={{ width: "250px" }} to="/forgot-password">
             Esqueci minha senha
          </Link>

          <Link style={{ width: "250px" }} to="/signIn-client">
            Ir para login da cooperativa.
          </Link> */}
          {/* // Dentro do form, antes do botão */}
          <Link to="/forgot-password" style={{ alignSelf: "flex-start" }}>
            Esqueci minha senha
          </Link>
          <Button
            fullWidth
            type="submit"
            variant="contained"
            disabled={loading}
            style={{ color: "white" }}
          >
            {loading ? <CircularProgress size={20} /> : "Entrar"}
          </Button>
        </form>
        <Typography
          variant="body2"
          align="center"
          style={{ marginTop: "12px" }}
        >
          <Link to="/signIn-client">Acessar como cooperativa</Link>
        </Typography>
      </Card>
      {/* ⭐️ PARTE 5: Adicionar o componente Snackbar (TOAST) */}
      {snackbarMessage && ( // Só renderiza se houver mensagem
        <Snackbar
          open={snackbarOpen}
          autoHideDuration={6000}
          onClose={handleCloseSnackbar}
          anchorOrigin={{ vertical: "top", horizontal: "center" }}
        >
          <Alert
            onClose={handleCloseSnackbar}
            severity="success" // Cor verde e ícone de sucesso
            sx={{ width: "100%" }}
          >
            {snackbarMessage}
          </Alert>
        </Snackbar>
      )}
    </SignInContainer>
  );
}
