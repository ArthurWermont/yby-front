import api from "./api";

// get wastes
export const getWastes = async () => {
  try {
    const response = await api.get("/wastes?pagination[limit]=1000");
    return response.data;
  } catch (error) {
    console.error("Erro ao buscar os resíduos:", error);
    return null;
  }
};
