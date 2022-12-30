import axios from "axios";

const api = axios.create({
  baseURL: "https://findnumbers.up.railway.app",
});

export default api;
