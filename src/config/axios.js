import axs from "axios";
import Cookie from "js-cookie";

// Axios instance avec cookies
const axios = axs.create({
  baseURL: "https://e-market-dh-03e9602f6d1a.herokuapp.com/api/",
  withCredentials: true, // pour envoyer cookies HTTP-only
});

// Intercepteur pour ajouter le token aux requêtes
axios.interceptors.request.use((config) => {
  const token = Cookie.get("accessToken");
  if (token) {
    config.headers["Authorization"] = `Bearer ${token}`;
  }
  return config;
});

// Intercepteur pour refresh automatique du token
axios.interceptors.response.use(
  (response) => response,
  async (error) => {
    const originalRequest = error.config;

    if (error.response?.status === 401 && !originalRequest._retry) {
      originalRequest._retry = true;
      try {
        const res = await axs.post(
          "https://e-market-dh-03e9602f6d1a.herokuapp.com/api/auth/refresh",
          {},
          { withCredentials: true }
        );
        Cookie.set("accessToken", res.data.accessToken);
        originalRequest.headers["Authorization"] = `Bearer ${res.data.accessToken}`;
        return axios(originalRequest);
      } catch (err) {
        console.error("Refresh token invalide :", err);
        return Promise.reject(err);
      }
    }
    return Promise.reject(error);
  }
);

export default axios;
