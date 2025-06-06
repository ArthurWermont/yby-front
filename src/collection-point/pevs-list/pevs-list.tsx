import EventIcon from "@mui/icons-material/Event";
import { Button, Card, TextField, Typography } from "@mui/material";
import { Key, useState } from "react";

export const PEVSList = ({
  pevs,
  handleSelectedPevs,
}: {
  handleSelectedPevs: any;
  pevs: any;
}) => {
  const hoje = new Date();
  const diaDaSemana = hoje.toLocaleString("pt-BR", { weekday: "long" });

  const compareDays = (diaAbreviado: string[]) => {
    const diaCompleto: { [key: string]: string } = {
      seg: "segunda-feira",
      ter: "terça-feira",
      qua: "quarta-feira",
      qui: "quinta-feira",
      sex: "sexta-feira",
    };

    return diaAbreviado.some((dia) => diaCompleto[dia] === diaDaSemana);
  };

  const [searchTerm, setSearchTerm] = useState("");

  const handleSearchTermChange = (
    event: React.ChangeEvent<HTMLInputElement>
  ) => {
    setSearchTerm(event.target.value);
  };

  const filteredDataPevs = pevs
    .filter((item: any) =>
      item.social_name.toLowerCase().includes(searchTerm.toLowerCase())
    )
    .sort((a: { days: string[] }, b: { days: string[] }) => {
      const compareDaysA = compareDays(a.days);
      const compareDaysB = compareDays(b.days);
      if (compareDaysA && !compareDaysB) return -1;
      if (!compareDaysA && compareDaysB) return 1;
      return 0;
    });

  const getCurrentDay = () => {
    const dias = ["dom", "seg", "ter", "qua", "qui", "sex", "sab"];
    const today = new Date();
    const dayOfWeek = today.getDay();
    return dias[dayOfWeek];
  };

  const isCollected = (id: string) => {
    const idsSalvos = localStorage.getItem("ids")
      ? JSON.parse(localStorage.getItem("ids") || "[]")
      : [];

    return idsSalvos.includes(String(id));
  };

  return (
    <>
      <div
        style={{
          display: "flex",
          flexDirection: "column",
          justifyContent: "center",
          gap: "20px",
          marginTop: "20px",
          width: "100%",
          alignItems: "center",
        }}
      >
        <div style={{ display: "flex", alignItems: "center", width: "100%" }}>
          <TextField
            id="filter-basic"
            label="Pesquisar"
            variant="outlined"
            onChange={handleSearchTermChange}
            placeholder="Pesquisar por título"
            value={searchTerm}
            style={{ flex: 1 }}
            size="small"
          />
        </div>

        {filteredDataPevs.map(
          (
            pev: {
              id: string;
              documentId: string;
              adress_data: any;
              social_name: string;
              days: string[];
            },
            index: Key
          ) => (
            <Card
              key={index}
              style={{
                display: "flex",
                flexDirection: "column",
                width: "95%",
                backgroundColor: "#F8F3E9",
                padding: "12px",
                gap: "12px",
              }}
            >
              <div
                style={{
                  display: "flex",
                  flexDirection: "row",
                  justifyContent: "space-between",
                  alignItems: "center",
                }}
              >
                <Typography style={{ fontWeight: "600", fontSize: "16px" }}>
                  {pev.social_name}
                </Typography>
              </div>

              <Typography style={{ fontWeight: "400", fontSize: "14px" }}>
                {`${pev?.adress_data[0]?.street}, ${pev?.adress_data[0]?.number}`}
              </Typography>

              <div
                style={{
                  display: "flex",
                  flexDirection: "row",
                  alignItems: "center",
                  gap: "8px",
                }}
              >
                <EventIcon style={{ fontSize: "16px" }} />
                <Typography style={{ fontWeight: "bold", fontSize: "12px" }}>
                  {pev?.days
                    .map((day) => {
                      const isToday = day === getCurrentDay();
                      return isToday ? "HOJE" : day.toUpperCase();
                    })
                    .sort((a, b) => (a === "HOJE" ? -1 : 1))
                    .join(", ")}
                </Typography>
              </div>

              <Button
                disabled={!compareDays(pev?.days) || isCollected(pev?.id)}
                variant="outlined"
                style={{
                  padding: "8px 16px",
                  borderRadius: "5px",
                  width: "100%",
                  marginBottom: "0px",
                }}
                onClick={() => handleSelectedPevs(pev)}
              >
                {isCollected(pev?.id) ? (
                  <>Já foi coletado</>
                ) : (
                  <>Coletar aqui</>
                )}
              </Button>
            </Card>
          )
        )}
      </div>
    </>
  );
};
