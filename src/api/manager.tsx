import api from "./api";

export type ManagerClient = {
  id?: number;
  documentId: string;
  social_name: string;
  cnpj?: string;
};

export type ManagerUser = {
  id?: number;
  documentId?: string;
  username: string;
  email: string;
};

export type ManagerResponse = {
  id?: number;
  documentId: string;
  user: ManagerUser | null;
  clients: ManagerClient[];
};

export type CreateManagerPayload = {
  username: string;
  email: string;
  password: string;
  clients: string[];
};

export type UpdateManagerPayload = {
  documentId: string;
  username: string;
  email: string;
  password?: string;
  clients: string[];
};

const createManager = async ({
  username,
  email,
  password,
  clients,
}: CreateManagerPayload): Promise<ManagerResponse | null> => {
  try {
    const response = await api.post("/managers", {
      data: {
        username,
        email,
        password,
        clients,
      },
    });

    return response.data;
  } catch (error: any) {
    console.error("Erro ao criar gestor:", error);
    console.error("Detalhes:", error?.response?.data);

    return null;
  }
};

const updateManager = async ({
  documentId,
  username,
  email,
  password,
  clients,
}: UpdateManagerPayload): Promise<ManagerResponse | null> => {
  try {
    const data: {
      username: string;
      email: string;
      clients: string[];
      password?: string;
    } = {
      username,
      email,
      clients,
    };

    if (password !== undefined && password !== "") {
      data.password = password;
    }

    const response = await api.put(`/managers/${documentId}`, {
      data,
    });

    return response.data;
  } catch (error: any) {
    console.error("Erro ao atualizar gestor:", error);
    console.error("Detalhes:", error?.response?.data);

    return null;
  }
};

const getManagers = async (): Promise<ManagerResponse[]> => {
  try {
    const response = await api.get(
      "/managers?populate[user]=*&populate[clients]=*&pagination[start]=0&pagination[limit]=100000",
    );

    return response.data?.data ?? [];
  } catch (error: any) {
    console.error("Erro ao buscar gestores:", error);
    console.error("Detalhes:", error?.response?.data);

    return [];
  }
};

export { createManager, updateManager, getManagers };
