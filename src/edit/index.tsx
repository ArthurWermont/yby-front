import {
  Autocomplete,
  Box,
  FormHelperText,
  TextField,
  ToggleButton,
  Typography,
} from "@mui/material";
import { useCallback, useEffect, useState } from "react";
import { Controller, useForm } from "react-hook-form";
import { useNavigate } from "react-router-dom";
import styled, { styled as styledComponents } from "styled-components";
import { getClientsByCNPJs, getClientsByName } from "../api/client";
import { getCooperatives } from "../api/cooperative";
import { getManagers } from "../api/manager";
import ClientFormEdit, { type ClientFormProps } from "./client-form";
import type { CooperativeFormProps } from "./cooperative-form";
import CooperativeForm from "./cooperative-form";
import type { ManagerFormProps } from "./manager-form";
import ManagerForm from "./manager-form";

type Option = {
  label: string;
  value: string;
  data?: any;
};

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
  const [cooperative, setCooperative] = useState<CooperativeFormProps | null>(
    null,
  );
  const [manager, setManager] = useState<ManagerFormProps | null>(null);
  const { control, reset } = useForm<{
    selectedOption: Option | null;
  }>({
    defaultValues: {
      selectedOption: null,
    },
  });
  const navigate = useNavigate();
  const [options, setOptions] = useState<Option[]>([]);
  const [value, setValue] = useState(() => getInitialValue(type));
  const isClientMode = value === 0;
  const isCooperativeMode = value === 1;
  const isManagerMode = value === 2;

  function getInitialValue(type: string) {
    if (type === "cliente") return 0;
    if (type === "cooperative") return 1;
    if (type === "manager") return 2;
    return 0;
  }

  const handleChange = (newValue: number) => {
    setValue(newValue);
    setClient(null);
    setCooperative(null);
    setManager(null);
    setOptions([]);

    reset({
      selectedOption: null,
    });

    if (newValue === 0) {
      navigate("/edit/client");
    }

    if (newValue === 1) {
      navigate("/edit/cooperative");
    }

    if (newValue === 2) {
      navigate("/edit/manager");
    }
  };

  useEffect(() => {
    setValue(getInitialValue(type));
    setClient(null);
    setCooperative(null);
    setManager(null);
    setOptions([]);

    reset({
      selectedOption: null,
    });
  }, [type, reset]);

  useEffect(() => {
    const fetchOptions = async () => {
      try {
        if (isClientMode) {
          const response = await getClientsByCNPJs([]);
          const clients = response.data.map((client: any) => ({
            label: client.social_name,
            value: client.social_name,
            data: client,
          }));
          setOptions(clients);
          return;
        }

        if (isCooperativeMode) {
          const response = await getCooperatives();
          const cooperatives = response.data.map((cooperative: any) => ({
            label: cooperative.cooperative_name,
            value: cooperative.documentId,
            data: cooperative,
          }));
          setOptions(cooperatives);
        }

        if (isManagerMode) {
          const response = await getManagers();

          const managers: Option[] = response.map((manager) => ({
            label: manager.user?.username || "Gestor sem usuário",
            value: manager.documentId,
            data: manager,
          }));

          setOptions(managers);
          return;
        }
      } catch (error) {
        console.error("Erro ao buscar opções:", error);
      }
    };

    fetchOptions();
  }, [isClientMode, isCooperativeMode, isManagerMode]);

  const selectClient = async (data: any) => {
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
          responseClientByName.data[0].clients,
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

      setCooperative(null);
      setManager(null);
    } catch (error) {
      console.error("Error finding client:", error);
    }
  };

  const selectCooperative = (option: Option) => {
    const selectedCooperative = option.data;

    if (!selectedCooperative) {
      setCooperative(null);
      return;
    }

    setCooperative({
      document_id: selectedCooperative.documentId,
      cooperative_name: selectedCooperative.cooperative_name,
      cooperative_code_access: selectedCooperative.cooperative_code_access,
      cooperative_employees: selectedCooperative.cooperative_employees,
    });

    setClient(null);
    setManager(null);
  };

  const selectManager = (option: Option) => {
    const selectedManager = option.data;

    if (!selectedManager) {
      setManager(null);
      return;
    }

    if (!selectedManager.user) {
      console.error("Gestor sem usuário vinculado:", selectedManager);
      setManager(null);
      alert("Este gestor não possui usuário de login vinculado.");
      return;
    }

    const clients =
      selectedManager.clients?.map((client: any) => ({
        label: client.social_name,
        value: client.documentId,
      })) || [];

    setManager({
      document_id: selectedManager.documentId,
      manager_username: selectedManager.user.username,
      manager_email: selectedManager.user.email,
      manager_clients: clients,
    });

    setClient(null);
    setCooperative(null);
  };

  const onSelect = async (data: Option | null) => {
    if (!data) {
      setClient(null);
      setCooperative(null);
      setManager(null);
      return;
    }

    if (isClientMode) {
      await selectClient(data);
      return;
    }

    if (isCooperativeMode) {
      selectCooperative(data);
    }

    if (isManagerMode) {
      selectManager(data);
    }
  };

  const Form = useCallback(() => {
    if (isClientMode && client) {
      return <ClientFormEdit key={client.document_id} client={client} />;
    }

    if (isCooperativeMode && cooperative) {
      return (
        <CooperativeForm
          key={cooperative.document_id}
          cooperative={cooperative}
        />
      );
    }

    if (isManagerMode && manager) {
      return <ManagerForm key={manager.document_id} manager={manager} />;
    }

    return <></>;
  }, [
    isClientMode,
    isCooperativeMode,
    isManagerMode,
    client,
    cooperative,
    manager,
  ]);

  const autocompleteLabel = isClientMode
    ? "Clientes"
    : isCooperativeMode
      ? "Cooperativas"
      : "Gestores";

  const autocompletePlaceholder = isClientMode
    ? "Selecione um cliente"
    : isCooperativeMode
      ? "Selecione uma cooperativa"
      : "Selecione um gestor";

  const autocompleteId = isClientMode
    ? "client_socialName"
    : isCooperativeMode
      ? "cooperative_name"
      : "manager_username";

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
            width: "520px",
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
            value="cliente"
            selected={value === 0}
            onChange={() => handleChange(0)}
          >
            CLIENTE
          </ToggleButton>

          <ToggleButton
            style={{
              backgroundColor:
                value === 1 ? "#15853B" : "rgb(200, 200, 200, 0.5)",
              flex: 1,
              height: "36px",
              border: "0px",
              borderTopRightRadius: "8px",
              borderBottomRightRadius: "8px",
              fontSize: "14px",
              textAlign: "center",
              cursor: "pointer",
              fontWeight: "600",
              color: value === 1 ? "white" : "#15853B",
            }}
            value="cooperativa"
            selected={value === 1}
            onChange={() => handleChange(1)}
          >
            COOPERATIVA
          </ToggleButton>

          <ToggleButton
            style={{
              backgroundColor:
                value === 2 ? "#15853B" : "rgb(200, 200, 200, 0.5)",
              flex: 1,
              height: "36px",
              border: "0px",
              borderTopRightRadius: "8px",
              borderBottomRightRadius: "8px",
              fontSize: "14px",
              textAlign: "center",
              cursor: "pointer",
              fontWeight: "600",
              color: value === 2 ? "white" : "#15853B",
            }}
            value="gestor"
            selected={value === 2}
            onChange={() => handleChange(2)}
          >
            GESTOR
          </ToggleButton>
        </div>

        <FormField size="420px">
          <Controller
            key={autocompleteId}
            name="selectedOption"
            control={control}
            rules={{ required: true }}
            render={({ field, fieldState }) => (
              <>
                <Autocomplete
                  id={autocompleteId}
                  size="small"
                  value={field.value}
                  onChange={(_, data) => {
                    field.onChange(data);
                    onSelect(data);
                  }}
                  renderInput={(params) => (
                    <TextField
                      {...params}
                      label={autocompleteLabel}
                      placeholder={autocompletePlaceholder}
                      error={fieldState.error ? true : false}
                    />
                  )}
                  options={options}
                  getOptionLabel={(option) => option.label || ""}
                  isOptionEqualToValue={(option, value) =>
                    option.value === value.value
                  }
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

        <Form />
      </StyledCenterContainer>
    </StyledContainer>
  );
}
