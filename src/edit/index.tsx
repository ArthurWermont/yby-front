import {
  Autocomplete,
  Box,
  FormHelperText,
  TextField,
  ToggleButton,
  Typography,
} from "@mui/material";
import { useCallback, useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import styled, { styled as styledComponents } from "styled-components";
import ClientFormEdit, { ClientFormProps } from "./client-form";
import { Controller, useForm } from "react-hook-form";
import { getClientsByCNPJs, getClientsByName } from "../api/client";

const FormField = styled(Box)<{ size?: string }>`
  width: 30%;
  max-width: ${(props) => props.size || "390px"};
  min-width: 200px;
  flex-grow: 1;
`;

const StyledContainer = styledComponents.div`
    display: flex;
    flex-direction: column;
    min-height: 100vh;
    height: 100%;
    width: 100%;
`;

const StyledCenterContainer = styledComponents.div`
    padding: 50px 40px 0;
`;

export default function Edit({ type }: { type: string }) {
  const [client, setClient] = useState<ClientFormProps | null>(null);
  const { control } = useForm();
  const navigate = useNavigate();
  const [options, setOptions] = useState([]);

  const [value, setValue] = useState(0);

  const handleChange = (newValue: number) => {
    if (newValue === 0) {
      navigate("/edit/client");
    }
    // if (newValue === 1) {
    //   navigate("/edit/cooperativa");
    // }
    setValue(newValue);
  };

  useEffect(() => {
    const fetchClients = async () => {
      try {
        const response = await getClientsByCNPJs([]);
        const clients = response.data.map((client: any) => ({
          label: client.social_name,
          value: client.social_name,
        }));
        setOptions(clients);
      } catch (error) {
        console.error("Error fetching clients:", error);
      }
    };
    fetchClients();
  }, []);

  useEffect(() => {
    if (type === "cliente") {
      setValue(0);
    }
    if (type === "cooperativa") {
      setValue(1);
    }
  }, [type]);

  const Form = useCallback(() => {
    if (client) {
      return <ClientFormEdit client={client} />;
    }
    return <></>;
  }, [client]);

  const onSubmit = async (data: any) => {
    if (!data) {
      setClient(null);
      return;
    }
    try {
      const responseClientByName = await getClientsByName(data.value);
      if (responseClientByName.data.length === 0) {
        setClient(null);
        return;
      }
      let address = responseClientByName.data[0].adress_data[0];
      if (responseClientByName.data[0].adress_data.length === 0) {
        address = {};
      }
      let clients = responseClientByName.data[0].clients || [];
      if (clients.length > 0) {
        const resClientsByCNPJ = await getClientsByCNPJs(
          responseClientByName.data[0].clients
        );
        clients = resClientsByCNPJ.data.map((client: any) => ({
          value: client.cnpj,
          label: client.social_name,
        }));
      }
      setClient({
        document_id: responseClientByName.data[0].documentId,
        client_address_document_id: address.documentId,
        client_cnpj: responseClientByName.data[0].cnpj,
        client_socialName: responseClientByName.data[0].social_name,
        client_responsibleName: responseClientByName.data[0].responsible_name,
        client_email: responseClientByName.data[0].email,
        client_phone: responseClientByName.data[0].phone,
        client_clients: clients,
        client_cep: address.cep,
        client_street: address.street,
        client_street_number: address.number,
        client_neighborhood: address.neighborhood,
        client_state: address.state,
        client_city: address.city,
      });
    } catch (error) {
      console.error("Error finding client:", error);
    }
  };

  return (
    <StyledContainer>
      <StyledCenterContainer>
        <Typography
          style={{ fontSize: "32px", fontWeight: "600", color: "#4B3838" }}
        >
          Edição
        </Typography>

        <div
          style={{
            display: "flex",
            width: "280px",
            gap: "4px",
            marginTop: "18px",
            marginBottom: "22px",
          }}
        >
          <ToggleButton
            style={{
              backgroundColor:
                value === 0 ? "#15853B" : "rgb(200, 200, 200, 0.5)",
              flex: 1,
              height: "36px",
              border: "0px",
              borderTopLeftRadius: "8px",
              borderBottomLeftRadius: "8px",
              fontSize: "14px",
              textAlign: "center",
              cursor: "pointer",
              fontWeight: "600",
              color: value === 0 ? "white" : "#15853B",
            }}
            value="clientw"
            selected={value === 0}
            onChange={() => handleChange(0)}
          >
            CLIENTE
          </ToggleButton>
          <FormField>
            <Controller
              name={"client_socialName"}
              control={control}
              rules={{ required: true }}
              render={({ field, fieldState }) => (
                <>
                  <Autocomplete
                    id="client_socialName"
                    size="small"
                    onChange={(_, data) => {
                      onSubmit(data);
                    }}
                    renderInput={(params) => (
                      <TextField
                        {...params}
                        {...field}
                        id="client_socialName"
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
        </div>
        <Form />
      </StyledCenterContainer>
    </StyledContainer>
  );
}
