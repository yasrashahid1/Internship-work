import axios from "axios";

export const api = axios.create({
  baseURL: "http://127.0.0.1:8000/api/",
});

api.interceptors.request.use((config) => {
  const token = localStorage.getItem("access");
  if (token) config.headers.Authorization = `Bearer ${token}`;
  return config;
});

api.interceptors.response.use(
  (res) => res, 
  async (err) => {
    if (err.response?.status === 401) {
      console.log("Access expired, trying refresh...");

      try {
        const refresh = localStorage.getItem("refresh");
        if (refresh) {
          const { data } = await axios.post("http://127.0.0.1:8000/api/auth/refresh/", {
            refresh,
          });

          localStorage.setItem("access", data.access);

          if (window?.alert) 
            {
            alert("Your session was refreshed. You are still logged in ✅");
          }

          err.config.headers.Authorization = `Bearer ${data.access}`;
          return api(err.config);
        }
      } catch (refreshError) {
        console.error("Refresh token failed, logging out...");
        localStorage.removeItem("access");
        localStorage.removeItem("refresh");
        window.location.href = "/login";
      }
    }

    return Promise.reject(err);
  }
);
