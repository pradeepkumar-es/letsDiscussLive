import axios from "axios";
export const api = axios.create({
  // baseURL: import.meta.env.VITE_BACKEND_API_URL,
  // No need for import.meta.env.VITE_BACKEND_API_URL anymore bcz we are serving frontend from backend 
  baseURL:"/api",
  withCredentials: true // send/receive auth cookie
});
