import { Search } from "@mui/icons-material";
import {
  Button,
  FormControl,
  InputLabel,
  MenuItem,
  Select,
  TextField,
} from "@mui/material";
import { useContext, useEffect, useState } from "react";
import { useImmer } from "use-immer";
import { AuthContext } from "../../context/auth-context";
import { type IContext, useReportsContext } from "../context";
import { getCooperatives } from "../../api/cooperative";

export const Filters = () => {
  const { user: currentUser } = useContext(AuthContext);
  const isClient = !!currentUser?.client_id;
  const { search, onSearchChange } = useReportsContext();
  const [cooperativeOptions, setCooperativeOptions] = useState<
    { label: string; value: string }[]
  >([]);
  const [fields, setFields] = useImmer<IContext["search"]>({
    pev: "",
    cooperative: "",
    startDate: search.startDate,
    endDate: search.endDate,
    sortByDate: "desc",
    waste: "",
    selectedClient: "",
  });

  const handleFilter = () => {
    const hasDiff = Object.keys(fields).some((key) => {
      return (
        fields[key as keyof IContext["search"]] !==
        search[key as keyof IContext["search"]]
      );
    });

    if (onSearchChange && hasDiff) {
      onSearchChange(fields);
    }
  };

  useEffect(() => {
    const fetchCooperatives = async () => {
      try {
        const response = await getCooperatives();

        const cooperatives = response.data.map((cooperative: any) => ({
          label: cooperative.cooperative_name,
          value: cooperative.documentId,
        }));

        setCooperativeOptions(cooperatives);
      } catch (error) {
        console.error("Erro ao buscar cooperativas:", error);
      }
    };

    fetchCooperatives();
  }, []);

  return (
    <>
      <div id="filters">
        {!isClient && (
          <>
            <TextField
              label="Buscar"
              variant="outlined"
              value={fields.pev}
              onChange={(e) =>
                setFields((draft) => {
                  draft.pev = e.target.value;
                })
              }
              size="small"
              style={{ width: "300px" }}
            />

            <FormControl size="small" style={{ width: "300px" }}>
              <InputLabel id="cooperative-label">Cooperativa</InputLabel>

              <Select
                labelId="cooperative-label"
                label="Cooperativa"
                value={fields.cooperative}
                onChange={(e) =>
                  setFields((draft) => {
                    draft.cooperative = e.target.value;
                  })
                }
              >
                <MenuItem value="">Todas</MenuItem>

                {cooperativeOptions.map((option) => (
                  <MenuItem key={option.value} value={option.value}>
                    {option.label}
                  </MenuItem>
                ))}
              </Select>
            </FormControl>
          </>
        )}

        <TextField
          label="Tipo de Resíduos"
          variant="outlined"
          value={fields.waste}
          onChange={(e) =>
            setFields((draft) => {
              draft.waste = e.target.value;
            })
          }
          size="small"
          style={{ width: "300px" }}
        />

        <TextField
          label="Data Inicial"
          type="date"
          value={fields.startDate}
          onChange={(e) =>
            setFields((draft) => {
              draft.startDate = e.target.value;
            })
          }
          slotProps={{ inputLabel: { shrink: true } }}
          size="small"
        />
        <TextField
          label="Data Final"
          type="date"
          value={fields.endDate}
          onChange={(e) =>
            setFields((draft) => {
              draft.endDate = e.target.value;
            })
          }
          slotProps={{ inputLabel: { shrink: true } }}
          size="small"
        />

        <Button
          variant="outlined"
          startIcon={<Search />}
          onClick={handleFilter}
        >
          Filtrar
        </Button>
      </div>
    </>
  );
};
