import {
  Autocomplete,
  AutocompleteRenderInputParams,
  Button,
  CircularProgress,
  Divider,
  FormHelperText,
  TextField,
  Typography,
} from "@mui/material";
import { Box, styled } from "@mui/system";
import { Controller, useForm } from "react-hook-form";
import { createClient, getClients, updateClient } from "../api/client";
import { AddressFormComponent } from "../register/components/address-form-component";

import { yupResolver } from "@hookform/resolvers/yup";
import React, { useEffect, useState } from "react";
import * as yup from "yup";

import { IMaskInput } from "react-imask";

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

interface CustomProps {
  onChange: (event: { target: { name: string; value: string } }) => void;
  name: string;
}

const PhoneMaskCustom = React.forwardRef<HTMLInputElement, CustomProps>(
  function TextMaskCustom(props, ref) {
    const { onChange, ...other } = props;
    return (
      <IMaskInput
        {...other}
        mask="(00) 0000-0000"
        definitions={{
          "#": /[1-9]/,
        }}
        inputRef={ref}
        onAccept={(value: any) =>
          onChange({ target: { name: props.name, value } })
        }
        overwrite
      />
    );
  }
);

const CNPJMaskCustom = React.forwardRef<HTMLInputElement, CustomProps>(
  function TextMaskCustom(props, ref) {
    const { onChange, ...other } = props;
    return (
      <IMaskInput
        {...other}
        mask="00.000.000/0000-00"
        definitions={{
          "#": /[1-9]/,
        }}
        inputRef={ref}
        onAccept={(value: any) =>
          onChange({ target: { name: props.name, value } })
        }
        overwrite
      />
    );
  }
);

const schema = yup.object().shape({
  client_clients: yup.array().of(yup.object()),
  client_cnpj: yup
    .string()
    .required("CNPJ é obrigatório")
    .min(14, "CNPJ deve ter pelo menos 14 dígitos"),
  client_socialName: yup.string().required("Razão Social é obrigatória"),
  client_responsibleName: yup
    .string()
    .required("Nome do Responsável é obrigatório"),
  client_email: yup
    .string()
    .required("E-mail é obrigatório")
    .email("Formato de e-mail inválido")
    .matches(
      /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/,
      "E-mail inválido"
    ),
  client_phone: yup
    .string()
    // .required("Telefone é obrigatório")
    .min(10, "Telefone deve ter pelo menos 10 dígitos"),
  client_cep: yup
    .string()
    .required("CEP é obrigatório")
    .min(8, "CEP deve ter 8 dígitos"),
  client_street: yup.string().required("Rua é obrigatória"),
  client_street_number: yup
    .number()
    .typeError("Número da rua é obrigatório.")
    .required("Número da rua é obrigatório."),
  client_neighborhood: yup.string().required("Bairro é obrigatório"),
  client_state: yup.string().required("Estado é obrigatório"),
  client_city: yup.string().required("Cidade é obrigatória"),
});

export type ClientFormProps = {
  document_id: string;
  client_address_document_id: string;
  client_cnpj: string;
  client_socialName: string;
  client_responsibleName: string;
  client_email: string;
  client_phone: string;
  client_cep: string;
  client_street: string;
  client_street_number: number;
  client_neighborhood: string;
  client_state: string;
  client_city: string;
  client_clients: { value: string; label: string}[];
};

type Props = {
  client: ClientFormProps;
};

export default function ClientForm({
  client: {
    document_id,
    client_address_document_id,
    client_cnpj,
    client_socialName,
    client_responsibleName,
    client_email,
    client_phone,
    client_cep,
    client_street,
    client_street_number,
    client_neighborhood,
    client_state,
    client_city,
    client_clients,
  },
}: Props) {
  const [loading, setLoading] = useState(false);
  const [options, setOptions] = useState([]);

  const { control, handleSubmit, reset, setError, register } = useForm({
    defaultValues: {
      client_clients,
      client_cnpj,
      client_socialName,
      client_responsibleName,
      client_email,
      client_phone,
      client_cep,
      client_street,
      client_street_number,
      client_neighborhood,
      client_state,
      client_city,
    },
    resolver: yupResolver(schema),
  });

  useEffect(() => {
    getClients().then((res) => {
      console.log("res", res);
      const data = res.data.map((client: any) => {
        return {
          value: client.cnpj,
          label: client.social_name,
        };
      });
      setOptions(data);
    });
  }, []);

  const onSubmit = async (data: any) => {
    setLoading(true);

    data.client_cnpj = data.client_cnpj.replace(/[./-]/g, "");
    data.client_phone = data.client_phone.replace(/[()\s-]/g, "");
    data.client_cep = data.client_cep.replace(/[-]/g, "");

    // todo: ajustar ordem de criacao no back , para nao ter 2 empresas publicadas com msm nome
    try {
      const updatedClient = await updateClient({
        document_id,
        cnpj: data.client_cnpj,
        social_name: data.client_socialName,
        responsible_name: data.client_responsibleName,
        email: data.client_email,
        phone: data.client_phone,
        password: data.client_password,
        clients: data.client_clients.map(
          (c: { value: string; label: string }) => c.value
        ),
        adress_data: {
          documentId: client_address_document_id,
          cep: data.client_cep,
          street: data.client_street,
          number: data.client_street_number,
          neighborhood: data.client_neighborhood,
          city: data.client_city,
          state: data.client_state,
        },
      });
      if (updatedClient) {
        alert("Cliente atualizado com sucesso!");
        // window.location.reload();

        setLoading(false);
      }
      setLoading(false);
    } catch (error) {
      setLoading(false);
      console.error("Error creating client:", error);
      alert("Erro ao criar cliente");
      reset();
    }
  };

  return (
    <div>
      <form key="submitedit" onSubmit={handleSubmit(onSubmit)}>
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

        {/* // */}
        <FormContainer>
          <FormField key={"client_socialName"}>
            <Controller
              name={"client_socialName"}
              control={control}
              rules={{ required: true }}
              render={({ field, fieldState }) => (
                <>
                  <TextField
                    {...field}
                    id={"client_socialName"}
                    type="outlined"
                    placeholder={"Razão Social"}
                    required={true}
                    fullWidth
                    label={"Razão Social"}
                    variant="outlined"
                    size="small"
                    autoComplete="off"
                    error={fieldState.error ? true : false}
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

          <FormField key={"client_cnpj"}>
            <Controller
              name={"client_cnpj"}
              control={control}
              rules={{ required: true }}
              render={({ field, fieldState }) => (
                <>
                  <TextField
                    {...field}
                    id={"client_cnpj"}
                    label="Número de CNPJ"
                    required={true}
                    placeholder={"CNPJ"}
                    type="outlined"
                    slotProps={{
                      input: {
                        inputComponent: CNPJMaskCustom as any,
                      },
                    }}
                    size="small"
                    autoComplete="off"
                    error={fieldState.error ? true : false}
                    variant="outlined"
                    fullWidth
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

          <FormField key={"client_responsibleName"}>
            <Controller
              name={"client_responsibleName"}
              control={control}
              rules={{ required: true }}
              render={({ field, fieldState }) => (
                <>
                  <TextField
                    {...field}
                    id={"client_responsibleName"}
                    type="outlined"
                    placeholder={"Nome do Responsável"}
                    required={true}
                    fullWidth
                    label={"Nome do Responsável"}
                    variant="outlined"
                    size="small"
                    autoComplete="off"
                    error={fieldState.error ? true : false}
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

          <FormField key={"client_email"}>
            <Controller
              name={"client_email"}
              control={control}
              rules={{ required: true }}
              render={({ field, fieldState }) => (
                <>
                  <TextField
                    {...field}
                    id={"client_email"}
                    type="outlined"
                    placeholder={"E-mail do cliente"}
                    required={true}
                    fullWidth
                    label={"E-mail"}
                    variant="outlined"
                    size="small"
                    autoComplete="off"
                    error={fieldState.error ? true : false}
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

          <FormField key={"client_phone"}>
            <Controller
              name={"client_phone"}
              control={control}
              rules={{ required: true }}
              render={({ field, fieldState }) => (
                <>
                  <TextField
                    {...field}
                    id={"client_phone"}
                    label="Telefone"
                    type="outlined"
                    slotProps={{
                      input: {
                        inputComponent: PhoneMaskCustom as any,
                      },
                    }}
                    size="small"
                    autoComplete="off"
                    error={fieldState.error ? true : false}
                    variant="outlined"
                    fullWidth
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

          <FormField>
            <Controller
              name={"client_clients"}
              control={control}
              rules={{ required: true }}
              render={({ field, fieldState }) => (
                <>
                  <Autocomplete
                    multiple
                    limitTags={2}
                    id="client_clients"
                    size="small"
                    onChange={(_, data) => field.onChange(data)}
                    renderInput={(params) => (
                      <TextField
                        {...params}
                        {...field}
                        id="client_clients"
                        label="Clientes"
                        placeholder="Clientes"
                        error={fieldState.error ? true : false}
                      />
                    )}
                    options={options}
                    defaultValue={field.value}
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
          Endereço
        </Typography>
        <Divider style={{ backgroundColor: "#4B3838" }} />

        <div>
          <AddressFormComponent
            key={"AddressFormComponent"}
            control={control}
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
              "Editar"
            )}
          </Button>
        </div>
      </form>
    </div>
  );
}
