import axios from "../config/axios";
import clientLogger from "./clientLogger";

// Intercepter les erreurs API
axios.interceptors.response.use(
  (response) => {
    // Log des succès API (optionnel)
    if (response.config.method !== "get") {
      clientLogger.info("API Success", {
        method: response.config.method?.toUpperCase(),
        url: response.config.url,
        status: response.status,
      });
    }
    return response;
  },
  (error) => {
    // Logger les erreurs API
    clientLogger.error("API Error", {
      method: error.config?.method?.toUpperCase(),
      url: error.config?.url,
      status: error.response?.status,
      message: error.response?.data?.message || error.message,
    });
    return Promise.reject(error);
  }
);

export default axios;
