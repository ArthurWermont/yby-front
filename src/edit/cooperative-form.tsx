import {
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
import { updateCooperative } from "../api/cooperative";

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

const schema = yup.object().shape({
  cooperative_name: yup
    .string()
    .required("Nome da cooperativa é obrigatório")
    .min(3, "O nome deve ter pelo menos 3 caracteres"),

  cooperative_code_access: yup
    .string()
    .required("Código de acesso é obrigatório")
    .min(3, "O código deve ter pelo menos 3 caracteres"),

  cooperative_employees: yup
    .number()
    .typeError("Informe um número válido")
    .required("Quantidade de cooperados é obrigatória")
    .min(0, "A quantidade não pode ser negativa"),
});

export type CooperativeFormProps = {
  document_id: string;
  cooperative_name: string;
  cooperative_code_access: string;
  cooperative_employees?: number;
};

type Props = {
  cooperative: CooperativeFormProps;
};

export default function CooperativeForm({
  cooperative: {
    document_id,
    cooperative_name,
    cooperative_code_access,
    cooperative_employees,
  },
}: Props) {
  const [loading, setLoading] = useState(false);

  const { control, handleSubmit, reset } = useForm({
    defaultValues: {
      cooperative_name,
      cooperative_code_access,
      cooperative_employees: cooperative_employees ?? 0,
    },
    resolver: yupResolver(schema),
  });

  useEffect(() => {
    reset({
      cooperative_name,
      cooperative_code_access,
      cooperative_employees: cooperative_employees ?? 0,
    });
  }, [
    document_id,
    cooperative_name,
    cooperative_code_access,
    cooperative_employees,
    reset,
  ]);

  const onSubmit = async (data: any) => {
    setLoading(true);

    try {
      const updatedCooperative = await updateCooperative({
        document_id,
        cooperative_name: data.cooperative_name.trim(),
        cooperative_code_access: data.cooperative_code_access.trim(),
        cooperative_employees: Number(data.cooperative_employees),
      });

      if (updatedCooperative) {
        alert("Cooperativa atualizada com sucesso!");
        window.location.reload();
        return;
      }

      alert("Erro ao atualizar cooperativa");
    } catch (error) {
      console.error("Erro ao atualizar cooperativa:", error);
      alert("Erro ao atualizar cooperativa");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div>
      <form key="submit-edit-cooperative" onSubmit={handleSubmit(onSubmit)}>
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
          <FormField key={"cooperative_name"}>
            <Controller
              name={"cooperative_name"}
              control={control}
              rules={{ required: true }}
              render={({ field, fieldState }) => (
                <>
                  <TextField
                    {...field}
                    id={"cooperative_name"}
                    placeholder={"Nome da cooperativa"}
                    required
                    fullWidth
                    label={"Nome da cooperativa"}
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

          <FormField key={"cooperative_code_access"}>
            <Controller
              name={"cooperative_code_access"}
              control={control}
              rules={{ required: true }}
              render={({ field, fieldState }) => (
                <>
                  <TextField
                    {...field}
                    id={"cooperative_code_access"}
                    placeholder={"Código de acesso"}
                    required
                    fullWidth
                    label={"Código de acesso"}
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

          <FormField key={"cooperative_employees"}>
            <Controller
              name={"cooperative_employees"}
              control={control}
              rules={{ required: true }}
              render={({ field, fieldState }) => (
                <>
                  <TextField
                    {...field}
                    id={"cooperative_employees"}
                    type="number"
                    placeholder={"Quantidade de cooperados"}
                    required
                    fullWidth
                    label={"Quantidade de cooperados"}
                    variant="outlined"
                    size="small"
                    autoComplete="off"
                    error={!!fieldState.error}
                    slotProps={{
                      htmlInput: {
                        min: 0,
                      },
                    }}
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
