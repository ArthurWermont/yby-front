import api from "./api";

type Address = {
  documentId?: string;
  street: string;
  cep: string;
  number: string;
  neighborhood: string;
  state: string;
  city: string;
};

type Client = {
  document_id?: string;
  cnpj: string;
  social_name: string;
  email: string;
  responsible_name: string;
  password: string;
  phone: string;
  adress_data: Address;
  clients?: string[];
};

const createClient = async ({
  cnpj,
  social_name,
  email,
  responsible_name,
  password,
  phone,
  adress_data,
}: Client) => {
  try {
    const response = await api.post("/clients", {
      data: {
        cnpj,
        social_name,
        email,
        responsible_name,
        password,
        phone,
        adress_data: [
          {
            street: adress_data.street,
            cep: adress_data.cep,
            number: adress_data.number,
            neighborhood: adress_data.neighborhood,
            state: adress_data.state,
            city: adress_data.city,
          },
        ],
      },
    });
    // alert created client
    alert(
      `O cliente ${social_name} foi criado com sucesso! e criado o Pev: ${adress_data.street}`
    );
    return response.data;
  } catch (error) {
    console.error("Erro ao fazer login:", error);

    return null;
  }
};

const updateClient = async ({
  document_id,
  cnpj,
  social_name,
  email,
  responsible_name,
  password,
  phone,
  adress_data,
  clients,
}: Client) => {
  try {
    const response = await api.put(`/clients/${document_id}`, {
      data: {
        cnpj,
        social_name,
        email,
        responsible_name,
        password,
        phone,
        clients,
        adress_data: [
          {
            documentId: adress_data.documentId,
            street: adress_data.street,
            cep: adress_data.cep,
            number: adress_data.number,
            neighborhood: adress_data.neighborhood,
            state: adress_data.state,
            city: adress_data.city,
          },
        ],
      },
    });
    return response.data;
  } catch (error) {
    console.error("Erro ao atualizar cliente:", error);
    return null;
  }
};

const getClients = async () => {
  try {
    const response = await api.get(
      "/clients?populate=adress_data&pagination[start]=0&pagination[limit]=100000"
    );
    return response.data;
  } catch (error) {
    console.error("Erro ao buscar os clientes:", error);
    return null;
  }
};

const getClientsByName = async (name: string) => {
  try {
    const response = await api.get(
      `/clients?populate=adress_data&filters[social_name][$eq]=${name}`
    );
    return response.data;
  } catch (error) {
    console.error("Erro ao buscar os clientes:", error);
    return null;
  }
};

const getClientsByCNPJs = async (cnpjs: string[]) => {
  try {
    const query = cnpjs
      .reduce((acc, cnpj, index) => {
        return acc + `filters[cnpj][$in][${index}]=${cnpj}&`;
      }, "")
      .slice(0, -1);
    const response = await api.get(`/clients?${query}`);
    console.log("Response:", response);
    return response.data;
  } catch (error) {
    console.error("Erro ao buscar os clientes:", error);
    return null;
  }
};

const getSingleClients = async ({ clientId }: { clientId: string }) => {
  try {
    const response = await api.get(`/clients/${clientId}?populate=adress_data`);
    return response.data;
  } catch (error) {
    console.error("Erro ao buscar os clientes:", error);
    return null;
  }
};

export {
  createClient,
  getClients,
  getSingleClients,
  getClientsByName,
  updateClient,
  getClientsByCNPJs,
};
