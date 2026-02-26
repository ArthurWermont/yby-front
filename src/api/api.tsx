import axios from "axios";

const api = axios.create({
  baseURL: `https://back.somosyby.com/api`,
  headers: {
    "Content-Type": "application/json",
    "Access-Control-Allow-Origin": "*",
  },
});

// Interceptor para adicionar o token a todas as requisições
api.interceptors.request.use(
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

export default api;
