import axios from "axios";

export const anxiosInstance = axios.create({
  baseURL: "http://localhost:5000/api",
});
