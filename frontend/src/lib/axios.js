import axios from "axios";
import queryClient from "./queryClient";
import { navigate } from "./navigation";

const options = {
  baseURL: import.meta.env.VITE_API_URL,
  withCredentials: true,
};

const TokenRefreshClient = axios.create(options);
TokenRefreshClient.interceptors.response.use((response) => response.data);

const axiosInstance = axios.create(options);

axiosInstance.interceptors.response.use(
  (response) => response.data,
  async (error) => {
    const { status, data } = response;
    console.log("Error: ", error);
    console.log("Data: ", data);

    // try to refresh the token
    if (
      (status === 401 && data.error === "InvalidAccessToken") ||
      data.error === "Token expired"
    ) {
      try {
        await TokenRefreshClient.get("/auth/refresh-token");
        return TokenRefreshClient(error.config);
      } catch (error) {
        queryClient.clear();
        navigate("/login", {
          state: { redirectUrl: window.location.pathname },
        });
      }
    }
    return Promise.reject({ status, ...data });
  }
);

export default axiosInstance;
