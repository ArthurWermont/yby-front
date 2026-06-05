import api from "./api";

const authAdmin = async ({
  identifier,
  password,
}: {
  identifier: string;
  password: string;
}) => {
  try {
    const response = await api.post("/auth/local", {
      identifier,
      password,
    });

    return response.data;
  } catch (error) {
    console.error("Erro ao fazer login:", error);

    return null;
  }
};

const authClient = async ({
  identifier,
  password,
}: {
  identifier: string;
  password: string;
}) => {
  try {
    const response = await api.post("/auth/local", {
      identifier,
      password,
    });

    return response.data;
  } catch (error) {
    console.error("Erro ao fazer login:", error);

    return null;
  }
};

const getMe = async (token: string) => {
  try {
    const response = await api.get(
      "/users/me?populate[role]=*&populate[clients]=*&populate[manager][populate][clients]=*",
      {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      },
    );

    return response.data;
  } catch (error) {
    console.error("Erro ao buscar usuário completo:", error);
    return null;
  }
};

export { authAdmin, authClient, getMe };
