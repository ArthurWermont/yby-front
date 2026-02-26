import { Search } from "@mui/icons-material";
import { Button, TextField } from "@mui/material";
import { useContext } from "react";
import { useImmer } from "use-immer";
import { AuthContext } from "../../context/auth-context";
import { type IContext, useReportsContext } from "../context";

export const Filters = () => {
  const { user: currentUser } = useContext(AuthContext);
  const isClient = !!currentUser?.client_id;
  const { search, onSearchChange } = useReportsContext();
  const [fields, setFields] = useImmer<IContext["search"]>({
    pev: "",
    startDate:search.startDate,
    endDate:search.endDate,
    sortByDate: "desc",
    waste: "",
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

  return (
    <>
      <div id="filters">
        {!isClient && (
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
