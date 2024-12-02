import { Typography } from "@mui/material";
import { useContext, useEffect, useState } from "react";
import { styled as styledComponents } from "styled-components";
import { getCollection, getCollectionClient } from "../api/collection";
import { AuthContext } from "../context/auth-context";
import TableComponent from "./components/table";

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

export default function Reports() {
  const [collections, setCollections] = useState<any>([]);

  const { user: currentUser } = useContext(AuthContext);

  const isClient = !!currentUser?.client_id;

  const formatCollection = (data: any) => {
    const formattedData = data.map((collection: any) => {
      const wastes =
        collection?.wastes.map((item: any) => item.name).join(", ") || "";

      const wastesIds = collection?.wastes.map((item: any) => item.id);

      return {
        documentId: collection.documentId,
        id: collection.id || "",
        pev: collection?.client?.social_name || "",
        waste: wastes || "",
        weight: collection?.weight || "",
        createdAt: collection?.createdAt || "",
        imageAvaria: collection?.breakdown?.url || "",
        imageColectorUrl: collection.colector?.url || "",
        wastesIds: wastesIds || [],
      };
    });

    return formattedData;
  };

  useEffect(() => {
    if (isClient) {
      const getCollectionsData = async () => {
        const response = await getCollectionClient({
          documentId: currentUser?.client_id,
        });
        //   console.log(response.data);
        const formattedData = formatCollection(response.data);
        setCollections(formattedData);
      };
      getCollectionsData();
    } else {
      const getCollectionsData = async () => {
        const response = await getCollection();
        //   console.log(response.data);
        const formattedData = formatCollection(response.data);
        setCollections(formattedData);
      };

      getCollectionsData();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return (
    <StyledContainer>
      <StyledCenterContainer>
        <Typography
          style={{ fontSize: "32px", fontWeight: "600", color: "#4B3838" }}
        >
          Relatórios
        </Typography>

        <TableComponent collections={collections} />
      </StyledCenterContainer>
    </StyledContainer>
  );
}
