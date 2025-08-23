import axios from "axios";
export const api = axios.create({
  // baseURL: "http://localhost:5000/api",
  baseURL: import.meta.env.VITE_BACKEND_API_URL,
  withCredentials: true // send/receive auth cookie
});
