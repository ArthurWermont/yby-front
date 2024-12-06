import api from "./api";

const uploadImage = async (file: any): Promise<any[]> => {
  const formData = new FormData();
  formData.append("files", file);

  const dadosUsuario = localStorage.getItem("usuario");

  const token = dadosUsuario && JSON.parse(dadosUsuario)?.jwt;

  try {
    // Envia os dados com fetch
    const response = await fetch("http://44.201.188.105:1337/api/upload", {
      method: "POST",
      body: formData,
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });

    return response.json();
  } catch (error) {
    console.error("Erro ao fazer upload:", error);
    return [];
  }
};

const createCollection = async (data: any) => {
  try {
    const response = await api.post("/collections", {
      data,
    });

    return response.data;
  } catch (error) {
    console.error("Erro ao criar a coleta:", error);
    return null;
  }
};

const getCollection = async () => {
  try {
    const response = await api.get("/collections?populate=*");
    return response.data;
  } catch (error) {
    console.error("Erro ao buscar as coletas:", error);
    return null;
  }
};

const getCollectionClient = async ({
  documentId,
}: {
  documentId: string | undefined;
}) => {
  try {
    const response = await api.get(
      `/collections?filters[client][documentId][$eq]=${documentId}&populate=*`
    );
    alert("Editado com sucesso!");
    return response.data;
  } catch (error) {
    console.error("Erro ao buscar as coletas:", error);
    alert("falha ao editar coleta!");
    return null;
  }
};

const editCollection = async ({ documentId, data }: any) => {
  try {
    const response = await api.put(`/collections/${documentId}`, {
      data,
    });
    return response.data;
  } catch (error) {
    console.error("Erro ao editar:", error);
    return null;
  }
};

const deleteCollection = async (documentId: any) => {
  try {
    const response = await api.delete(`/collections/${documentId}`);
    return response.data;
  } catch (error) {
    console.error("Erro ao deletar:", error);
    return null;
  }
};

export {
  createCollection,
  deleteCollection,
  editCollection,
  getCollection,
  getCollectionClient,
  uploadImage,
};
