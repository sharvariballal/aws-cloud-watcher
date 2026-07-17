import axios from "axios";

const api = axios.create({
  baseURL: "http://localhost:5000/api",
});

api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem("token");

    console.log("Interceptor running...");
    console.log("Token:", token);

    if (token) {
      config.headers = config.headers || {};
      config.headers.Authorization = `Bearer ${token}`;
      console.log("Authorization header attached");
    } else {
      console.log("No token found");
    }

    return config;
  },
  (error) => Promise.reject(error)
);

export default api;