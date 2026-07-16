import api from "./api";

const compressImageFile = async (file: File): Promise<File> => {
  if (!file.type.startsWith("image/")) {
    return file;
  }

  const MAX_WIDTH = 1280;
  const MAX_HEIGHT = 1280;
  const QUALITY = 0.72;

  return new Promise((resolve) => {
    const image = new Image();
    const objectUrl = URL.createObjectURL(file);

    image.onload = () => {
      URL.revokeObjectURL(objectUrl);

      const originalWidth = image.width;
      const originalHeight = image.height;

      const scale = Math.min(
        MAX_WIDTH / originalWidth,
        MAX_HEIGHT / originalHeight,
        1,
      );

      const width = Math.round(originalWidth * scale);
      const height = Math.round(originalHeight * scale);

      const canvas = document.createElement("canvas");
      canvas.width = width;
      canvas.height = height;

      const context = canvas.getContext("2d");

      if (!context) {
        resolve(file);
        return;
      }

      context.fillStyle = "#FFFFFF";
      context.fillRect(0, 0, width, height);
      context.drawImage(image, 0, 0, width, height);

      canvas.toBlob(
        (blob) => {
          if (!blob) {
            resolve(file);
            return;
          }

          const fileNameWithoutExtension = file.name.replace(/\.[^/.]+$/, "");

          const compressedFile = new File(
            [blob],
            `${fileNameWithoutExtension}.jpg`,
            {
              type: "image/jpeg",
              lastModified: Date.now(),
            },
          );

          resolve(compressedFile);
        },
        "image/jpeg",
        QUALITY,
      );
    };

    image.onerror = () => {
      URL.revokeObjectURL(objectUrl);
      resolve(file);
    };

    image.src = objectUrl;
  });
};

const uploadImage = async (file: File): Promise<any[]> => {
  const compressedFile = await compressImageFile(file);

  const formData = new FormData();
  formData.append("files", compressedFile);

  const dadosUsuario = localStorage.getItem("usuario");
  const token = dadosUsuario ? JSON.parse(dadosUsuario)?.jwt : null;

  const apiBaseUrl = String(api.defaults.baseURL || "").replace(/\/$/, "");

  try {
    const response = await fetch(`${apiBaseUrl}/upload`, {
      method: "POST",
      body: formData,
      headers: {
        ...(token ? { Authorization: `Bearer ${token}` } : {}),
      },
    });

    if (!response.ok) {
      const errorText = await response.text();
      console.error("Erro no upload:", response.status, errorText);
      return [];
    }

    return await response.json();
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

const createCollectionWithItems = async (data: any) => {
  const response = await api.post("/collections/with-items", {
    data,
  });

  return response.data;
};

const getCollection = async () => {
  try {
    // Faz a primeira requisição para obter o número total de páginas
    const firstResponse = await api.get(
      "/collections?populate=*&pagination[page]=1&pagination[pageSize]=100",
    );

    const totalPages = firstResponse.data.meta.pagination.pageCount;

    // Cria um array de promessas para buscar todas as páginas
    const requests = [];
    for (let page = 1; page <= totalPages; page++) {
      requests.push(
        api.get(
          `/collections?populate=*&pagination[page]=${page}&pagination[pageSize]=100`,
        ),
      );
    }

    // Aguarda todas as requisições serem concluídas
    const responses = await Promise.all(requests);

    // Extrai e combina os dados de todas as páginas
    const data = responses.map((response) => response.data);
    const joinData = data.flatMap((item) => item.data);

    return formatCollectionData(joinData);
  } catch (error) {
    console.error("Erro ao buscar as coletas:", error);
    return [];
  }
};

const getCollectionByDate = async (startDate: Date, endDate: Date) => {
  try {
    // Get first page to check total pages
    const firstResponse = await api.get(
      `/collections?` +
        `filters[$or][0][collection_date][$notNull]=true&` +
        `filters[$or][0][collection_date][$gte]=${startDate.toISOString()}&` +
        `filters[$or][0][collection_date][$lte]=${endDate.toISOString()}&` +
        `filters[$or][1][collection_date][$null]=true&` +
        `filters[$or][1][createdAt][$gte]=${startDate.toISOString()}&` +
        `filters[$or][1][createdAt][$lte]=${endDate.toISOString()}&` +
        `populate=*&pagination[page]=1&pagination[pageSize]=100`,
    );

    const totalPages = firstResponse.data.meta.pagination.pageCount;

    // Create array of requests for all pages
    const requests = [];
    for (let page = 1; page <= totalPages; page++) {
      requests.push(
        api.get(
          `/collections?` +
            `filters[$or][0][collection_date][$notNull]=true&` +
            `filters[$or][0][collection_date][$gte]=${startDate.toISOString()}&` +
            `filters[$or][0][collection_date][$lte]=${endDate.toISOString()}&` +
            `filters[$or][1][collection_date][$null]=true&` +
            `filters[$or][1][createdAt][$gte]=${startDate.toISOString()}&` +
            `filters[$or][1][createdAt][$lte]=${endDate.toISOString()}&` +
            `populate=*&pagination[page]=${page}&pagination[pageSize]=100`,
        ),
      );
    }

    // Wait for all requests to complete
    const responses = await Promise.all(requests);

    // Combine data from all pages
    const data = responses.map((response) => response.data);
    const joinData = data.flatMap((item) => item.data);

    return { data: formatCollectionData(joinData) };
  } catch (error) {
    console.error("Erro ao buscar as coletas deste mês:", error);
    return null;
  }
};

const getCollectionClient = async ({
  documentId,
}: {
  documentId: string | undefined;
}): Promise<{ data: any[] }> => {
  try {
    const clienteResponse = await api.get(`/clients/${documentId}`);
    const clients = clienteResponse.data.data.clients;
    let query = "";
    if (clients) {
      query = clienteResponse.data.data.clients
        .reduce((acc: string, cnpj: string, index: number) => {
          return acc + `filters[$or][${index + 1}][client][cnpj][$in]=${cnpj}&`;
        }, "")
        .slice(0, -1);
    }
    const response = await api.get(
      `/collections?filters[$or][0][client][documentId][$eq]=${documentId}&populate=*&pagination[start]=0&pagination[limit]=100000&${query}`,
    );
    return { data: formatCollectionData(response.data.data) };
  } catch (error) {
    console.error("Erro ao buscar as coletas:", error);
    return { data: [] };
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

const editCollectionItem = async ({ documentId, data }: any) => {
  try {
    const response = await api.put(`/collection-items/${documentId}`, {
      data,
    });

    return response.data;
  } catch (error: any) {
    console.error(
      "Erro ao editar item da coleta:",
      error?.response?.data || error,
    );

    throw new Error(
      error?.response?.data?.error?.message || "Erro ao editar item da coleta.",
    );
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

const formatCollectionData = (data: any): any[] => {
  return data.map((item: any) => {
    return {
      ...item,
      collection_date: item.collection_date
        ? new Date(item.collection_date)
        : item.createdAt,
    };
  });
};

const getCollectionByDateForClient = async (
  clientDocumentId: string,
  startDate: Date,
  endDate: Date,
) => {
  try {
    // 1ª página para saber quantas existem
    const first = await api.get(
      `/collections?` +
        `filters[$and][0][$or][0][collection_date][$notNull]=true&` +
        `filters[$and][0][$or][0][collection_date][$gte]=${startDate.toISOString()}&` +
        `filters[$and][0][$or][0][collection_date][$lte]=${endDate.toISOString()}&` +
        `filters[$and][0][$or][1][collection_date][$null]=true&` +
        `filters[$and][0][$or][1][createdAt][$gte]=${startDate.toISOString()}&` +
        `filters[$and][0][$or][1][createdAt][$lte]=${endDate.toISOString()}&` +
        `filters[$and][1][client][documentId][$eq]=${encodeURIComponent(clientDocumentId)}&` + // <<<< trava pelo cliente
        `populate=*&pagination[page]=1&pagination[pageSize]=100`,
    );

    const totalPages: number = first.data.meta.pagination.pageCount;
    const reqs: Promise<any>[] = [];

    for (let page = 1; page <= totalPages; page++) {
      reqs.push(
        api.get(
          `/collections?` +
            `filters[$and][0][$or][0][collection_date][$notNull]=true&` +
            `filters[$and][0][$or][0][collection_date][$gte]=${startDate.toISOString()}&` +
            `filters[$and][0][$or][0][collection_date][$lte]=${endDate.toISOString()}&` +
            `filters[$and][0][$or][1][collection_date][$null]=true&` +
            `filters[$and][0][$or][1][createdAt][$gte]=${startDate.toISOString()}&` +
            `filters[$and][0][$or][1][createdAt][$lte]=${endDate.toISOString()}&` +
            `filters[$and][1][client][documentId][$eq]=${encodeURIComponent(clientDocumentId)}&` +
            `populate=*&pagination[page]=${page}&pagination[pageSize]=100`,
        ),
      );
    }

    const pages = await Promise.all(reqs);
    const flat = pages.flatMap((r) => r.data.data || []);
    return { data: formatCollectionData(flat) };
  } catch (e) {
    console.error("Erro ao buscar coletas do cliente:", e);
    return { data: [] as any[] };
  }
};

export {
  createCollection,
  createCollectionWithItems,
  deleteCollection,
  editCollection,
  editCollectionItem,
  getCollection,
  getCollectionClient,
  getCollectionByDate,
  uploadImage,
  getCollectionByDateForClient,
};
