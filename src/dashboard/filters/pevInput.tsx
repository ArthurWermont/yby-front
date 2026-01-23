import CloseIcon from "@mui/icons-material/Close";
import {
  FormControl,
  IconButton,
  InputLabel,
  MenuItem,
  Select,
} from "@mui/material";
import { FC, useContext, useEffect, useState } from "react";
import { getClientsByCNPJs } from "../../api/client";
import { AuthContext } from "../../context/auth-context";
import { useDashboardContext } from "../context";

export type IOptions = {
  label: string;
  value: string;
};

const PevInput: FC = () => {
  const { pev, changeFilters, mode } = useDashboardContext();
  const [options, setOptions] = useState<IOptions[]>([]);

  const { user } = useContext(AuthContext);
  const clientDocId: string | undefined =
    (user as any)?.client_id || (user as any)?.client?.documentId;

  const fetchOptionsPev = async () => {
    try {
      const response = await getClientsByCNPJs([]);
      const clients = response.data.map((client: any) => ({
        label: client.social_name,
        value: client.documentId,
      }));
      // console.log(clients)
      setOptions(clients);
    } catch (error) {
      console.error("Erro ao buscar PEVs:", error);
    }
  };

  useEffect(() => {
    fetchOptionsPev();
  }, []);

  const onChange = (value: string) => {
    const pevName = options.find((o) => o.value == value)?.label;

    console.log(pevName)
    changeFilters({
      pev: value,
      pevName,
    });
  };

  useEffect(() => {
    if (options.length > 0) {
      onChange(clientDocId!);
    }
  }, [options]);

  return (
    <FormControl sx={{ width: 230 }}>
      <InputLabel id="pev-label">
        {mode !== "client" ? "Selecionar PEV" : "PEV selecionado"}
      </InputLabel>
      <Select
        labelId="pev-label"
        value={pev}
        onChange={(e) => onChange(e.target.value)}
        label={mode !== "client" ? "Selecionar PEV" : "PEV selecionado"}
        readOnly={mode === "client"}
        endAdornment={
          pev &&
          mode !== "client" && (
            <IconButton
              size="small"
              sx={{ marginRight: 2 }}
              onClick={(e) => {
                e.stopPropagation();
                onChange("");
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
