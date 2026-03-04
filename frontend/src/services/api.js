import axios from 'axios';
import { logger } from '../utils/logger';

// Aponta para o servidor
const apiClient = axios.create({
  baseURL: import.meta.env.VITE_API_URL || 'http://localhost:8000/api',
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
  
  smartAssist: async ({ titulo, tipo, url }) => {  // <--  'url'
    logger.info("POST /api/smart-assist", { titulo, tipo, url });
    try {
      // <-- 'url'
      const response = await apiClient.post('/smart-assist', { titulo, tipo, url }); 
      return response.data;
    } catch(e) {
      const erroReal = e.response?.data?.detail || e.message;
      logger.error("Smart Assist falhou no backend!", erroReal);
      throw new Error(erroReal);
    }
  },

  gerarAula: async (payload) => {
    logger.info("POST /gerar_aula (Motor IA V-LAB)", payload);
    try {
      // Cria uma instância isolada apontando para ia.rlight.com.br
      // Use uma variável de ambiente ou faça o fallback para o localhost da API Python
      const iaClient = axios.create({
        baseURL: import.meta.env.VITE_IA_API_URL || 'http://localhost:8000'
      });
      
      const response = await iaClient.post('/gerar_aula', payload);
      return response.data;
    } catch(e) {
      logger.error("Falha ao comunicar com o Motor de IA", e.message);
      throw e;
    }
  

  },

  
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

syncDocente: async (payload) => {
    logger.info("POST /api/docentes", payload);
    try {
      const response = await apiClient.post('/docentes', payload);
      return response.data;
    } catch(e) {
      logger.error("Falha ao salvar docente no banco", e.message);
      throw e;
    }
  },

};