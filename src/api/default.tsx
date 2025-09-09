import axios from "axios";

const apiDefault = axios.create({
  baseURL: "https://back.somosyby.com",
  headers: {
    "Content-Type": "application/json",
    "Access-Control-Allow-Origin": "*",
  },
});

// Interceptor para adicionar o token a todas as requisições
apiDefault.interceptors.request.use(
  (config) => {
    const dadosUsuario = localStorage.getItem("usuario");

    const token = dadosUsuario && JSON.parse(dadosUsuario)?.jwt;

    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }

    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

export default apiDefault;
