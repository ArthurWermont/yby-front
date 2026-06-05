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
import { yupResolver } from "@hookform/resolvers/yup";
import { Controller, useForm } from "react-hook-form";
import { useEffect, useState } from "react";
import * as yup from "yup";
import { getClients } from "../api/client";
import { updateManager } from "../api/manager";

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

const schema = yup.object().shape({
  manager_username: yup
    .string()
    .required("Nome do gestor é obrigatório")
    .min(3, "O nome deve ter pelo menos 3 caracteres"),

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
    .default("")
    .defined()
    .test(
      "password-min-length",
      "A nova senha deve ter pelo menos 6 caracteres",
      (value) => value === "" || value.length >= 6,
    ),

  manager_clients: yup
    .array()
    .of(
      yup.object().shape({
        label: yup.string().required(),
        value: yup.string().required(),
      }),
    )
    .min(1, "Selecione pelo menos um cliente")
    .required("Clientes vinculados são obrigatórios"),
});

export type ManagerFormProps = {
  document_id: string;
  manager_username: string;
  manager_email: string;
  manager_clients: ClientOption[];
};

type Props = {
  manager: ManagerFormProps;
};

type ManagerEditFormData = {
  manager_username: string;
  manager_email: string;
  manager_password: string;
  manager_clients: ClientOption[];
};

export default function ManagerForm({
  manager: { document_id, manager_username, manager_email, manager_clients },
}: Props) {
  const [loading, setLoading] = useState(false);
  const [clientOptions, setClientOptions] = useState<ClientOption[]>([]);

  const { control, handleSubmit, reset } = useForm<ManagerEditFormData>({
    defaultValues: {
      manager_username,
      manager_email,
      manager_password: "",
      manager_clients,
    },
    resolver: yupResolver(schema),
  });

  useEffect(() => {
    reset({
      manager_username,
      manager_email,
      manager_password: "",
      manager_clients,
    });
  }, [document_id, manager_username, manager_email, manager_clients, reset]);

  useEffect(() => {
    const fetchClients = async () => {
      try {
        const response = await getClients();

        const clients = response.data.map((client: any) => ({
          label: client.social_name,
          value: client.documentId,
        }));

        setClientOptions(clients);
      } catch (error) {
        console.error("Erro ao buscar clientes:", error);
      }
    };

    fetchClients();
  }, []);

  const onSubmit = async (data: ManagerEditFormData) => {
    setLoading(true);

    try {
      const updatedManager = await updateManager({
        documentId: document_id,
        username: data.manager_username.trim(),
        email: data.manager_email.trim(),
        password: data.manager_password || undefined,
        clients: data.manager_clients.map(
          (client: ClientOption) => client.value,
        ),
      });

      if (updatedManager) {
        alert("Gestor atualizado com sucesso!");
        window.location.reload();
        return;
      }

      alert("Erro ao atualizar gestor");
    } catch (error) {
      console.error("Erro ao atualizar gestor:", error);
      alert("Erro ao atualizar gestor");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div>
      <form key="submit-edit-manager" onSubmit={handleSubmit(onSubmit)}>
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
              rules={{ required: true }}
              render={({ field, fieldState }) => (
                <>
                  <TextField
                    {...field}
                    id="manager_username"
                    placeholder="Nome do gestor"
                    required
                    fullWidth
                    label="Nome do gestor"
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
              rules={{ required: true }}
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
                    placeholder="Nova senha"
                    fullWidth
                    label="Nova senha"
                    variant="outlined"
                    size="small"
                    autoComplete="new-password"
                    error={!!fieldState.error}
                    helperText="Preencha somente para redefinir a senha do gestor"
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

          <FormField key="manager_clients" size="600px">
            <Controller
              name="manager_clients"
              control={control}
              rules={{ required: true }}
              render={({ field, fieldState }) => (
                <>
                  <Autocomplete
                    multiple
                    limitTags={2}
                    id="manager_clients"
                    size="small"
                    value={field.value || []}
                    onChange={(_, data) => field.onChange(data)}
                    options={clientOptions}
                    getOptionLabel={(option) => option.label || ""}
                    isOptionEqualToValue={(option, value) =>
                      option.value === value.value
                    }
                    renderInput={(params) => (
                      <TextField
                        {...params}
                        id="manager_clients"
                        label="Clientes vinculados"
                        placeholder="Selecione os clientes"
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
          </FormField>
        </FormContainer>

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
              "Editar"
            )}
          </Button>
        </div>
      </form>
    </div>
  );
}
