import { toast } from "react-toastify";
import api from "./api";

type Address = {
  street: string;
  cep: string;
  number: string;
  neighborhood: string;
  state: string;
  city: string;
};

type Client = {
  cnpj: string;
  social_name: string;
  email: string;
  responsible_name: string;
  password: string;
  phone: string;
  adress_data: Address;
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

const getSingleClients = async ({ clientId }: { clientId: string }) => {
  try {
    const response = await api.get(`/clients/${clientId}?populate=adress_data`);
    return response.data;
  } catch (error) {
    console.error("Erro ao buscar os clientes:", error);
    return null;
  }
};

const deleteClient = async (clientId: any) => {
  try {
    const response = await api.delete(`/clients/${clientId}`);
    console.log("Resposta da API:", response); // Verifique a resposta da API
    toast.success('Cliente excluído com sucesso!');
    return response.data;
  } catch (error: any) {
    console.error("Erro ao deletar:", error.response ? error.response.data : error.message);
    toast.error('Erro ao excluir o cliente!');
    return null;
  }
};


export { createClient, deleteClient, getClients, getSingleClients };
