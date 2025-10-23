import axios from "axios";
import { port } from "../Data";

// import {getToken} from './TokenHelper';
const getToken = () => {
  console.log("token");
  return null;
};
const axiosInstance = axios.create({
  baseURL: port,
});

axiosInstance.interceptors.request.use(
  async (config) => {
    const token = localStorage.getItem("token");
    if (token) {
      config.headers.Authorization = `${token}`;
    } else {
      delete config.headers.Authorization;
    }
    return config;
  },
  (error) => Promise.reject(error)
);

export default axiosInstance;
