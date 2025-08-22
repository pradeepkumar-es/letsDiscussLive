import axios from "axios";
export const api = axios.create({
  baseURL: import.meta.env.BACKEND_API_URL,
  withCredentials: true // send/receive auth cookie
});
