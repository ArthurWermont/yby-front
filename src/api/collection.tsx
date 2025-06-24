import api from "./api";

const uploadImage = async (file: any): Promise<any[]> => {
  const formData = new FormData();
  formData.append("files", file);

  const dadosUsuario = localStorage.getItem("usuario");

  const token = dadosUsuario && JSON.parse(dadosUsuario)?.jwt;

  try {
    // Envia os dados com fetch
    const response = await fetch("http://3.88.210.55:1337/api/upload", {
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
    // Faz a primeira requisição para obter o número total de páginas
    const firstResponse = await api.get(
      "/collections?populate=*&pagination[page]=1&pagination[pageSize]=100"
    );

    const totalPages = firstResponse.data.meta.pagination.pageCount;

    // Cria um array de promessas para buscar todas as páginas
    const requests = [];
    for (let page = 1; page <= totalPages; page++) {
      requests.push(
        api.get(
          `/collections?populate=*&pagination[page]=${page}&pagination[pageSize]=100`
        )
      );
    }

    // Aguarda todas as requisições serem concluídas
    const responses = await Promise.all(requests);

    // Extrai e combina os dados de todas as páginas
    const data = responses.map((response) => response.data);
    const joinData = data.flatMap((item) => item.data);

    console.log(joinData, data);

    return joinData;
  } catch (error) {
    console.error("Erro ao buscar as coletas:", error);
    return null;
  }
};

const getCollectionByDate = async (startDate: Date, endDate: Date) => {
  try {
    // Get first page to check total pages
    const firstResponse = await api.get(
      `/collections?filters[$and][0][createdAt][$gte]=${startDate.toISOString()}&filters[$and][1][createdAt][$lte]=${endDate.toISOString()}&populate=*&pagination[page]=1&pagination[pageSize]=100`
    );

    const totalPages = firstResponse.data.meta.pagination.pageCount;

    // Create array of requests for all pages
    const requests = [];
    for (let page = 1; page <= totalPages; page++) {
      requests.push(
        api.get(
          `/collections?filters[$and][0][createdAt][$gte]=${startDate.toISOString()}&filters[$and][1][createdAt][$lte]=${endDate.toISOString()}&populate=*&pagination[page]=${page}&pagination[pageSize]=100`
        )
      );
    }

    // Wait for all requests to complete
    const responses = await Promise.all(requests);

    // Combine data from all pages
    const data = responses.map((response) => response.data);
    const joinData = data.flatMap((item) => item.data);

    return { data: joinData };
  } catch (error) {
    console.error("Erro ao buscar as coletas deste mês:", error);
    return null;
  }
}

const getCollectionClient = async ({
  documentId,
}: {
  documentId: string | undefined;
}) => {
  try {
    const clienteResponse = await api.get(`/clients/${documentId}`);
    const clients = clienteResponse.data.data.clients;
    let query = "";
    if (clients) {
      query = clienteResponse.data.data.clients
        .reduce((acc: string, cnpj: string, index: number) => {
          return acc + `filters[$or][${index+1}][client][cnpj][$in]=${cnpj}&`;
        }, "")
        .slice(0, -1);
    }
    const response = await api.get(
      `/collections?filters[$or][0][client][documentId][$eq]=${documentId}&populate=*&pagination[start]=0&pagination[limit]=100000&${query}`
    );
    return response.data;
  } catch (error) {
    console.error("Erro ao buscar as coletas:", error);
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
  getCollectionByDate,
  uploadImage,
};
