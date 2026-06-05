import CloseIcon from "@mui/icons-material/Close";
import {
  FormControl,
  IconButton,
  InputLabel,
  MenuItem,
  Select,
} from "@mui/material";
import { type FC, useContext, useEffect, useState } from "react";
import { getClientsByCNPJs } from "../../api/client";
import { AuthContext } from "../../context/auth-context";
import { useDashboardContext } from "../context";

export type IOptions = {
  label: string;
  value: string;
};

const PevInput: FC = () => {
  const { pev, changeFilters, selectedPevs, selectedPevNames, mode } =
    useDashboardContext();

  const [options, setOptions] = useState<IOptions[]>([]);

  const { user } = useContext(AuthContext);
  const clientDocId: string | undefined =
    (user as any)?.client_id || (user as any)?.client?.documentId;

  const fetchOptionsPev = async () => {
    try {
      if (mode === "manager") {
        const managerOptions: IOptions[] = (
          (user?.manager?.clients ?? [])
            .map((client) => ({
              label: client.social_name || client.documentId || "Cliente",
              value: client.documentId || "",
            }))
            .filter((item) => !!item.value) as IOptions[]
        ).sort((a, b) =>
          (a.label || "").localeCompare(b.label || "", "pt-BR", {
            sensitivity: "base",
          }),
        );

        setOptions(managerOptions);
        return;
      }

      if (mode === "client") {
        if (!clientDocId) {
          setOptions([]);
          return;
        }

        setOptions([
          {
            label:
              (user as any)?.client?.social_name || user?.username || "Cliente",
            value: clientDocId,
          },
        ]);
        return;
      }

      const response = await getClientsByCNPJs([]);
      const clients = response.data
        .map((client: any) => ({
          label: client.social_name,
          value: client.documentId,
        }))
        .sort((a: IOptions, b: IOptions) =>
          (a.label || "").localeCompare(b.label || "", "pt-BR", {
            sensitivity: "base",
          }),
        );
      setOptions(clients);
    } catch (error) {
      console.error("Erro ao buscar PEVs:", error);
    }
  };

  useEffect(() => {
    fetchOptionsPev();
  }, [mode, user]);

  // const onChange = (value: string) => {
  //   const pevName = options.find((o) => o.value === value)?.label || "";

  //   changeFilters({
  //     pev: value,
  //     pevName,
  //   });
  // };

  const onChangeMultiple = (values: string[]) => {
    const selectedNames = options
      .filter((option) => values.includes(option.value))
      .map((option) => option.label);

    changeFilters({
      selectedPevs: values,
      selectedPevNames: selectedNames,
    });
  };

  useEffect(() => {
    if (options.length === 0) return;

    if (mode === "client" && clientDocId && selectedPevs.length === 0) {
      onChangeMultiple([clientDocId]);
      return;
    }

    if (mode === "manager" && selectedPevs.length === 0) {
      onChangeMultiple([options[0].value]);
      return;
    }
  }, [options, mode, clientDocId, selectedPevs.length]);

  const canClear = mode === "admin" && selectedPevs.length > 0;
  return (
    <FormControl sx={{ width: 230 }}>
      <InputLabel id="pev-label">
        {mode !== "client" ? "Selecionar PEV" : "PEV selecionado"}
      </InputLabel>
      <Select
        labelId="pev-label"
        multiple={mode !== "client"}
        value={mode === "client" ? (selectedPevs[0] ?? "") : selectedPevs}
        onChange={(e) => onChangeMultiple(e.target.value as string[])}
        label={mode !== "client" ? "Selecionar PEV" : "PEV selecionado"}
        readOnly={mode === "client"}
        renderValue={(selected) => {
          const values = selected as string[];

          if (values.length === 0) {
            return "";
          }

          const names =
            selectedPevNames.length > 0
              ? selectedPevNames
              : options
                  .filter((option) => values.includes(option.value))
                  .map((option) => option.label);

          return names.join(", ");
        }}
        endAdornment={
          canClear && (
            <IconButton
              size="small"
              sx={{ marginRight: 2 }}
              onClick={(e) => {
                e.stopPropagation();
                onChangeMultiple([]);
              }}
            >
              <CloseIcon fontSize="small" />
            </IconButton>
          )
        }
      >
        {options.map((option: any) => (
          <MenuItem key={option.value} value={option.value}>
            {option.label}
          </MenuItem>
        ))}
      </Select>
    </FormControl>
  );
};

export default PevInput;
