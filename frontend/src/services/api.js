import axios from "axios";

const API_URL = import.meta.env.VITE_API_URL || "http://localhost:5500/api";

const api = axios.create({
  baseURL: API_URL,
  headers: {
    "Content-Type": "application/json",
  },
});

// Interceptor para manejar errores globalmente
api.interceptors.response.use(
  (response) => response,
  (error) => {
    console.error("API Error:", error.response?.data || error.message);
    return Promise.reject(error);
  }
);

// Servicios de Riesgos
export const riesgoService = {
  // Obtener todos los riesgos
  getAll: async (params = {}) => {
    const response = await api.get("/riesgos", { params });
    return response.data;
  },

  // Obtener un riesgo por ID
  getById: async (id) => {
    const response = await api.get(`/riesgos/${id}`);
    return response.data;
  },

  // Crear nuevo riesgo
  create: async (data) => {
    const response = await api.post("/riesgos", data);
    return response.data;
  },

  // Actualizar riesgo
  update: async (id, data) => {
    const response = await api.put(`/riesgos/${id}`, data);
    return response.data;
  },

  // Eliminar riesgo
  delete: async (id) => {
    const response = await api.delete(`/riesgos/${id}`);
    return response.data;
  },

  // Obtener estadísticas
  getStats: async () => {
    const response = await api.get("/riesgos/stats/resumen");
    return response.data;
  },
};

export default api;
