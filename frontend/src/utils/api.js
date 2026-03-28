import axios from "axios";

const API_BASE_URL = "http://localhost:8000/api";

const apiClient = axios.create({
  baseURL: API_BASE_URL,
});

apiClient.interceptors.request.use((config) => {
  const token = localStorage.getItem("token");
  if (token) config.headers.Authorization = `Bearer ${token}`;
  return config;
});

export const startSession = async (form) => {
  const { data } = await apiClient.post("/session/start", { form });
  return data.data; // full session object
};

export const getSessionMessages = async (sessionId) => {
  const { data } = await apiClient.get(`/session/${sessionId}/messages`);
  return data.data.messages;
};

export const sendChatMessage = async ({ sessionId, message }) => {
  const { data } = await apiClient.post("/session/message", { sessionId, message });
  return data.data; // { answer, sessionId }
};

export const generateReport = async ({ sessionId, messages }) => {
  const { data } = await apiClient.post(`/session/generate-report/${sessionId}`, { messages });
  return data.formattedResponse;
};

// Clinics (Admin)
export const createClinic = async (payload) => {
  const { data } = await apiClient.post(`/clinic`, payload);
  return data.data;
};

export const listClinics = async ({ page = 1, limit = 20 } = {}) => {
  const { data } = await apiClient.get(`/clinic`, { params: { page, limit } });
  return data.data;
};

export const getClinic = async (id) => {
  const { data } = await apiClient.get(`/clinic/${id}`);
  return data.data;
};

export const updateClinic = async (id, payload) => {
  const { data } = await apiClient.put(`/clinic/${id}`, payload);
  return data.data;
};

export const deleteClinic = async (id) => {
  const { data } = await apiClient.delete(`/clinic/${id}`);
  return data.data;
};

// Weather Recommendations
export const getWeatherRecommendation = async ({ lat, lng, city }) => {
  const params = city ? { city } : { lat, lng };
  const { data } = await apiClient.get(`/recommendation/weather`, { params });
  return data.data;
};

export default apiClient;


