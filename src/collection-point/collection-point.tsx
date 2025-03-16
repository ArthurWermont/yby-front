import { Button, ToggleButton, Typography } from "@mui/material";
import { useContext, useEffect, useState } from "react";
import { styled as styledComponents } from "styled-components";
import { getClients } from "../api/client";
import { getListOfPevsByCooperative } from "../api/cooperative";
import { AuthContext } from "../context/auth-context";
import CollectionForm from "./collection-form/collection-form";
import { PEVSList } from "./pevs-list/pevs-list";

const StyledContainer = styledComponents.div`
  display: flex;
  flex-direction: column;
  width: 90%;
  padding: 25px;
  align-items: center;
  justify-content: center;
  overflow-x: hidden;
`;

const StyledTabContainer = styledComponents.div`
  display: flex;
  align-items: center;
  justify-content: center;
  margin-top: 50px;
  width: 100%;
  height: 40px;
  border-radius: 40px;
  border: 1px solid #EBEBEB ;
  background-color: #EBEBEB;
`;

export default function CollectionPoint() {
  const { user: currentUser } = useContext(AuthContext);
  const [userLocation, setUserLocation] = useState<{
    latitude: number;
    longitude: number;
  } | null>(null);
  const [selectedTab, setSelectedTab] = useState("pevs");
  const [selectedPEVS, setSelectedPEVS] = useState();

  const [pevs, setPevs] = useState<any[]>([]);

  const handleTabChange = (
    event: React.MouseEvent<HTMLElement>,
    value: any
  ) => {
    setSelectedTab(value);
    setSelectedPEVS(undefined);
  };

  const handleSelectedPevs = (pevs: any) => {
    setSelectedPEVS(pevs);
    setSelectedTab("coleta");
  };

  function buscarPorIds(
    resultIdsAndDays: { documentId: string; day: string[] }[],
    getPevs: { data: any[] }
  ) {
    const empresasEncontradas = getPevs?.data.filter(
      (item: { documentId: any }) =>
        resultIdsAndDays
          .map((result: any) => result.documentId)
          .includes(item.documentId)
    );

    if (empresasEncontradas.length > 0) {
      const empresasEncontradasComDias = empresasEncontradas.map(
        (item: { documentId: any }) => ({
          ...item,
          days: resultIdsAndDays
            .filter((result) => result.documentId === item.documentId)
            .map((result) => result.day)
            .flat(),
        })
      );

      return empresasEncontradasComDias;
    } else {
      return [];
      // return `Nenhuma empresa encontrada para os IDs fornecidos.`;
    }
  }

  useEffect(() => {
    const handleGetPevs = async () => {
      try {
        const response = await getListOfPevsByCooperative();
        const dias = ["seg", "ter", "qua", "qui", "sex", "sab", "dom"];

        const resultadoDosIds = response.data
          .filter((item: any) => {
            return dias.some(
              (dia) =>
                item[dia] &&
                item[dia].documentId === currentUser?.cooperative_id
            );
          })
          .map((item: { [key: string]: any }) => {
            const diasAtendidos = dias.filter(
              (dia) =>
                item[dia] &&
                item[dia].documentId === currentUser?.cooperative_id
            );
            return {
              documentId: item.client.documentId,
              day: diasAtendidos,
            };
          });

        const getPevs = await getClients();
        const resultado = buscarPorIds(resultadoDosIds, getPevs);
        setPevs(resultado);
      } catch (error) {
        console.error("Erro ao buscar os Pevs:", error);
        return null;
      }
    };

    handleGetPevs();
  }, [currentUser?.cooperative_id]);

  const handleGetLocation = () => {
    navigator.geolocation.getCurrentPosition((position) => {
      setUserLocation({
        latitude: position.coords.latitude,
        longitude: position.coords.longitude,
      });
    });
  };

  return (
    <StyledContainer>
      <Button onClick={handleGetLocation}>Get Location</Button>
      {userLocation && (
        <Typography>
          Latitude: {userLocation.latitude}, Longitude: {userLocation.longitude}
        </Typography>
      )}
      <StyledTabContainer>
        <ToggleButton
          style={{
            backgroundColor: selectedTab === "pevs" ? "white" : "transparent",
            flex: 1,
            height: "40px",
            borderRadius: "40px",
            border: "0px",
            fontSize: "14px",
            textAlign: "center",
            cursor: "pointer",
            color: "green",
          }}
          value="pevs"
          selected={selectedTab === "pevs"}
          onChange={handleTabChange}
        >
          PEVs
        </ToggleButton>
        <ToggleButton
          style={{
            backgroundColor: selectedTab === "coleta" ? "white" : "transparent",
            flex: 1,
            height: "40px",
            border: "0px",
            borderRadius: "40px",
            fontSize: "14px",
            textAlign: "center",
            cursor: "pointer",
            color: "green",
          }}
          value="coleta"
          selected={selectedTab === "coleta"}
          onChange={handleTabChange}
        >
          Coleta
        </ToggleButton>
      </StyledTabContainer>
      {selectedTab === "pevs" && (
        <PEVSList handleSelectedPevs={handleSelectedPevs} pevs={pevs} />
      )}
      {selectedTab === "coleta" && (
        <CollectionForm selectedPEV={selectedPEVS} pevs={pevs} />
      )}
    </StyledContainer>
  );
}
