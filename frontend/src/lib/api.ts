import axios from "axios";
export const api = axios.create({
  // baseURL: "http://localhost:5000/api",
  baseURL: "https://letsdiscusslive.onrender.com/api",
  withCredentials: true // send/receive auth cookie
});
