import axios from 'axios';
import { logger } from '../utils/logger';

// Aponta para o seu FastAPI rodando localmente
const apiClient = axios.create({
  baseURL: 'http://localhost:8000/api',
});

// Atraso artificial para testar loading states
const delay = ms => new Promise(r => setTimeout(r, ms));

export const api = {
  getResources: async ({ skip = 0, limit = 6 } = {}) => {
    logger.info("GET /api/resources", { skip, limit });
    try {
      const response = await apiClient.get(`/resources?skip=${skip}&limit=${limit}`);
      return response.data;
    } catch(e) {
      logger.error("Falha ao buscar recursos", e.message);
      throw e;
    }
  },
  
  createResource: async (payload) => {
    logger.info("POST /api/resources", payload);
    try {
      const response = await apiClient.post('/resources', payload);
      return response.data;
    } catch(e) {
      logger.error("Falha ao criar recurso", e.message);
      throw e;
    }
  },
  
  smartAssist: async ({ titulo, tipo }) => {
    logger.info("POST /api/smart-assist", { titulo, tipo });
    try {
      const response = await apiClient.post('/smart-assist', { titulo, tipo });
      return response.data;
    } catch(e) {
      // Pega o erro exato que o FastAPI enviou, ou o erro de rede
      const erroReal = e.response?.data?.detail || e.message;
      logger.error("Smart Assist falhou no backend!", erroReal);
      throw new Error(erroReal); // Lança o erro para o formulário exibir
    }
  },

  // ... (mantenha o getResources, createResource e smartAssist que já estavam aí)
  
  updateResource: async (id, payload) => {
    logger.info(`PUT /api/resources/${id}`, payload);
    try {
      const response = await apiClient.put(`/resources/${id}`, payload);
      return response.data;
    } catch(e) {
      logger.error("Falha ao atualizar recurso", e.message);
      throw e;
    }
  },
  
  deleteResource: async (id) => {
    logger.info(`DELETE /api/resources/${id}`);
    try {
      await apiClient.delete(`/resources/${id}`);
      return true;
    } catch(e) {
      logger.error("Falha ao deletar recurso", e.message);
      throw e;
    }
  },

};