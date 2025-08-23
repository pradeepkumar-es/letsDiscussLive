import axios from "axios";

const token = localStorage.getItem("token"); // Save token on login

export const api = axios.create({
  baseURL: import.meta.env.VITE_BACKEND_API_URL,
  headers: {
    Authorization: token ? `Bearer ${token}` : ""
  }
});
