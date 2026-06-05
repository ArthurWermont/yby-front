import { yupResolver } from "@hookform/resolvers/yup";
import {
  Autocomplete,
  Button,
  CircularProgress,
  Divider,
  FormHelperText,
  TextField,
  Typography,
} from "@mui/material";
import { Box, styled } from "@mui/system";
import React, { useEffect, useState } from "react";
import { Controller, useForm } from "react-hook-form";
import * as yup from "yup";

import { getClientsByCNPJs } from "../api/client";
import { createManager } from "../api/manager";

const FormContainer = styled(Box)({
  display: "flex",
  flexWrap: "wrap",
  gap: "20px",
  marginTop: "16px",
  marginBottom: "16px",
});

const FormField = styled(Box)<{ size?: string }>`
  width: 30%;
  max-width: ${(props) => props.size || "390px"};
  min-width: 200px;
  flex-grow: 1;
`;

type ClientOption = {
  label: string;
  value: string;
};

type ManagerCreateFormData = {
  manager_username: string;
  manager_email: string;
  manager_password: string;
  manager_clients: string[];
};

const schema = yup.object().shape({
  manager_username: yup
    .string()
    .required("Usuário é obrigatório")
    .min(3, "Usuário deve ter pelo menos 3 caracteres"),
  manager_email: yup
    .string()
    .required("E-mail é obrigatório")
    .email("Formato de e-mail inválido")
    .matches(
      /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/,
      "E-mail inválido",
    ),
  manager_password: yup
    .string()
    .required("Senha é obrigatória")
    .min(6, "Senha deve ter pelo menos 6 caracteres"),
  manager_clients: yup
    .array()
    .of(yup.string().required())
    .min(1, "Selecione pelo menos 1 cliente")
    .required("Selecione pelo menos 1 cliente"),
});

export default function ManagerForm() {
  const [loading, setLoading] = useState(false);
  const [loadingClients, setLoadingClients] = useState(false);
  const [clientOptions, setClientOptions] = useState<ClientOption[]>([]);

  const { control, handleSubmit, reset } = useForm<ManagerCreateFormData>({
    defaultValues: {
      manager_username: "",
      manager_email: "",
      manager_password: "",
      manager_clients: [] as string[],
    },
    resolver: yupResolver(schema),
  });

  const fetchClients = async () => {
    try {
      setLoadingClients(true);

      const response = await getClientsByCNPJs([]);
      const clients = response.data
        .map((client: any) => ({
          label: client.social_name,
          value: client.documentId,
        }))
        .sort((a: ClientOption, b: ClientOption) =>
          (a.label || "").localeCompare(b.label || "", "pt-BR", {
            sensitivity: "base",
          }),
        );

      setClientOptions(clients);
    } catch (error) {
      console.error("Erro ao buscar clientes:", error);
      alert("Erro ao carregar clientes");
    } finally {
      setLoadingClients(false);
    }
  };

  useEffect(() => {
    fetchClients();
  }, []);

  const onSubmit = async (data: ManagerCreateFormData) => {
    try {
      setLoading(true);

      const response = await createManager({
        username: data.manager_username.trim(),
        email: data.manager_email.trim(),
        password: data.manager_password,
        clients: data.manager_clients,
      });

      if (!response) {
        setLoading(false);
        alert("Erro ao criar gestor");
        return;
      }

      alert("Gestor criado com sucesso!");
      reset();
    } catch (error) {
      console.error("Erro ao criar gestor:", error);
      alert("Erro ao criar gestor");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div>
      <form onSubmit={handleSubmit(onSubmit)}>
        <Typography
          fontSize={20}
          marginTop={"16px"}
          color="#4B3838"
          fontWeight={"500"}
          gutterBottom
        >
          Dados básicos
        </Typography>
        <Divider style={{ backgroundColor: "#4B3838" }} />

        <FormContainer>
          <FormField key="manager_username">
            <Controller
              name="manager_username"
              control={control}
              render={({ field, fieldState }) => (
                <>
                  <TextField
                    {...field}
                    id="manager_username"
                    placeholder="Nome de usuário"
                    required
                    fullWidth
                    label="Usuário"
                    variant="outlined"
                    size="small"
                    autoComplete="off"
                    error={!!fieldState.error}
                  />
                  {fieldState.error && (
                    <FormHelperText style={{ color: "red" }}>
                      {fieldState.error.message}
                    </FormHelperText>
                  )}
                </>
              )}
            />
          </FormField>

          <FormField key="manager_email">
            <Controller
              name="manager_email"
              control={control}
              render={({ field, fieldState }) => (
                <>
                  <TextField
                    {...field}
                    id="manager_email"
                    placeholder="E-mail do gestor"
                    required
                    fullWidth
                    label="E-mail"
                    variant="outlined"
                    size="small"
                    autoComplete="off"
                    error={!!fieldState.error}
                  />
                  {fieldState.error && (
                    <FormHelperText style={{ color: "red" }}>
                      {fieldState.error.message}
                    </FormHelperText>
                  )}
                </>
              )}
            />
          </FormField>

          <FormField key="manager_password">
            <Controller
              name="manager_password"
              control={control}
              render={({ field, fieldState }) => (
                <>
                  <TextField
                    {...field}
                    id="manager_password"
                    type="password"
                    placeholder="Senha de acesso"
                    required
                    fullWidth
                    label="Senha"
                    variant="outlined"
                    size="small"
                    autoComplete="off"
                    error={!!fieldState.error}
                  />
                  {fieldState.error && (
                    <FormHelperText style={{ color: "red" }}>
                      {fieldState.error.message}
                    </FormHelperText>
                  )}
                </>
              )}
            />
          </FormField>
        </FormContainer>

        <Typography
          fontSize={20}
          gutterBottom
          color="#4B3838"
          fontWeight={"500"}
        >
          Clientes vinculados
        </Typography>
        <Divider style={{ backgroundColor: "#4B3838" }} />

        <div
          style={{ marginTop: "16px", marginBottom: "16px", maxWidth: "800px" }}
        >
          <Controller
            name="manager_clients"
            control={control}
            render={({ field, fieldState }) => (
              <>
                <Autocomplete
                  multiple
                  options={clientOptions}
                  loading={loadingClients}
                  disableCloseOnSelect
                  value={clientOptions.filter((option) =>
                    field.value?.includes(option.value),
                  )}
                  onChange={(_, newValue) => {
                    field.onChange(newValue.map((item) => item.value));
                  }}
                  getOptionLabel={(option) => option.label}
                  isOptionEqualToValue={(option, value) =>
                    option.value === value.value
                  }
                  renderInput={(params) => (
                    <TextField
                      {...params}
                      label="Clientes"
                      placeholder="Selecione um ou mais clientes"
                      size="small"
                      error={!!fieldState.error}
                    />
                  )}
                />
                {fieldState.error && (
                  <FormHelperText style={{ color: "red" }}>
                    {fieldState.error.message}
                  </FormHelperText>
                )}
              </>
            )}
          />
        </div>

        <div
          style={{
            display: "flex",
            justifyContent: "flex-end",
            marginTop: "10px",
          }}
        >
          <Button
            disabled={loading}
            style={{ color: "#ffff" }}
            type="submit"
            variant="contained"
          >
            {loading ? (
              <CircularProgress size={24} color="inherit" />
            ) : (
              "Cadastrar"
            )}
          </Button>
        </div>
      </form>
    </div>
  );
}
