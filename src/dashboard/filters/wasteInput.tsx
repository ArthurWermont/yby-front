import {
  FormControl,
  IconButton,
  InputLabel,
  MenuItem,
  Select,
} from "@mui/material";
import { FC, useEffect, useState } from "react";
import CloseIcon from "@mui/icons-material/Close";
import { getWastes } from "../../api/wastes";
import { useDashboardContext } from "../context";
import { IOptions } from "./pevInput";

const WasteInput: FC = () => {
  const [options, setOptions] = useState<IOptions[]>([]);
  const { waste, changeFilters } = useDashboardContext();

  const fetchOptionsResiduos = async () => {
    // Simulação de opções de resíduos
    try {
      const response = await getWastes();
      if (response && response.data) {
        const residuos = response.data.map((waste: any) => ({
          label: waste.name,
          value: waste.id,
        }));
        console.log(residuos);
        setOptions(residuos);
      }
    } catch (error) {
      console.error("Erro ao buscar opções de resíduos:", error);
    }
  };

  useEffect(() => {
    fetchOptionsResiduos();
  }, []);

  const onChange = (value: string) => {
    const wasteName = options.find((o) => o.value == value)?.label;

    changeFilters({
      waste: value,
      wasteName,
    });
  };

  return (
    <FormControl sx={{ width: 230 }}>
      <InputLabel id="tipo-label">Tipo de resíduo</InputLabel>
      <Select
        labelId="tipo-label"
        value={waste}
        onChange={(e) => onChange(e.target.value)}
        label="Tipo de resíduo"
        endAdornment={
          waste ? (
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
          ) : null
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

export default WasteInput;
