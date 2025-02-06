import { TextField } from "@mui/material";
import React, { useEffect, useState } from "react";
import { getCooperatives } from "../../api/cooperative";
import PevForm from "./pev-form";

const TableComponent = ({ planningList }: { planningList: any }) => {
  const [cooperatives, setCooperatives] = React.useState<any[]>([]);
  const [searchTerm, setSearchTerm] = useState("");

  const dataPev = planningList.map(
    (cooperative: {
      documentId: any;
      client: { social_name: any };
      seg: { id: any; cooperative_name: any };
      ter: { id: any; cooperative_name: any };
      qua: { id: any; cooperative_name: any };
      qui: { id: any; cooperative_name: any };
      sex: { id: any; cooperative_name: any };
    }) => ({
      id: cooperative.documentId,

      title: `${cooperative?.client?.social_name || ""}`,
      seg: cooperative.seg
        ? {
            value: cooperative.seg.id,
            label: cooperative.seg.cooperative_name,
          }
        : "",
      ter: cooperative.ter
        ? {
            value: cooperative.ter.id,
            label: cooperative.ter.cooperative_name,
          }
        : "",
      qua: cooperative.qua
        ? {
            value: cooperative.qua.id,
            label: cooperative.qua.cooperative_name,
          }
        : "",
      qui: cooperative.qui
        ? {
            value: cooperative.qui.id,
            label: cooperative.qui.cooperative_name,
          }
        : "",
      sex: cooperative.sex
        ? {
            value: cooperative.sex.id,
            label: cooperative.sex.cooperative_name,
          }
        : "",
    })
  );

  const handleSearchTermChange = (
    event: React.ChangeEvent<HTMLInputElement>
  ) => {
    setSearchTerm(event.target.value);
  };

  const filteredDataPev = dataPev
    .filter((item: any) =>
      item.title.toLowerCase().includes(searchTerm.toLowerCase())
    )
    .sort((a: any, b: any) => a.title.localeCompare(b.title));

  useEffect(() => {
    const getCooperativesList = async () => {
      try {
        const response = await getCooperatives();
        setCooperatives(response.data);
      } catch (error) {
        console.error("Erro ao buscar as cooperativas:", error);
        return null;
      }
    };

    getCooperativesList();
  }, []);

  return (
    <div>
      <TextField
        id="filter-basic"
        label="Pesquisar"
        variant="outlined"
        onChange={handleSearchTermChange}
        placeholder="Pesquisar por título"
        value={searchTerm}
        style={{ width: "300px" }}
      />

      <div>
        {filteredDataPev.map((pev: any) => (
          <PevForm
            key={pev.id}
            title={pev?.title}
            cooperatives={cooperatives}
            pev={pev}
          />
        ))}
      </div>
    </div>
  );
};

export default TableComponent;
