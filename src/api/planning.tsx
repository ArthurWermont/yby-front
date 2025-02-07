import api from "./api";

const getPlanningList = async () => {
  try {
    const response = await api.get(
      "/plannings?populate=*&pagination[start]=0&pagination[limit]=100000"
    );
    return response.data;
  } catch (error) {
    console.error("Erro ao buscar os cooperativas:", error);
    return null;
  }
};

const editPlanning = async ({ documentId, data }: any) => {
  try {
    const response = await api.put(`/plannings/${documentId}`, {
      data,
    });
    alert("Editado com sucesso!");
    return response.data;
  } catch (error) {
    console.error("Erro ao editar:", error);
    return null;
  }
};

export { editPlanning, getPlanningList };
