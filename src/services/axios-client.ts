import axios, { AxiosInstance, AxiosError, AxiosResponse } from "axios";

const apiURL = import.meta.env.VITE_BASE_URL;


const axiosClient = (token: string | null = null): AxiosInstance => {
  const headers = token
    ? {
        Authorization: `Bearer ${token}`,
        
        "Content-Type": "application/json;charset=utf-8",
      }
    : {
      "Content-Type": "application/json;charset=utf-8",
      };

    
  const client = axios.create({
    baseURL: apiURL,
    headers,
    timeout: 60000,
    withCredentials: false,
  });

  client.interceptors.request.use((config: any) => {
    const token = localStorage.getItem("ACCESS_TOKEN");
    config.headers = config.headers || {};
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  });

  client.interceptors.response.use(
    (response: AxiosResponse) => {
      return response;
    },
    (error: AxiosError) => {
      try {
        const { response } = error;
        if (response?.status === 401) {
          localStorage.removeItem("ACCESS_TOKEN");
        }
      } catch (e) {
        console.error(e);
      }
      throw error;
    }
  );

  return client;
};

export default axiosClient;
