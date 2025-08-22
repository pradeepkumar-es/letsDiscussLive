import axios from "axios";
export const api = axios.create({
  baseURL: import.meta.env.BACKEND_API_URL || "http://localhost:5000/api",
  withCredentials: true // send/receive auth cookie
});
