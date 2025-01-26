import axios from "axios";
import queryClient from "./queryClient";
import { navigate } from "./navigation";

const options = {
  baseURL: import.meta.env.VITE_API_URL,
  withCredentials: true,
  credentials: "include",
  headers: {
    "Content-Type": "application/json",
  },
};

const TokenRefreshClient = axios.create(options);
TokenRefreshClient.interceptors.response.use((response) => response.data);

const axiosInstance = axios.create(options);

axiosInstance.interceptors.response.use(
  (response) => response.data,
  async (error) => {
    const { status, data } = error.response;

    return Promise.reject({ status, ...data });
  }
);

// Function to periodically refresh the access token
const refreshAccessTokenPeriodically = () => {
  setInterval(async () => {
    try {
      await TokenRefreshClient.get("/auth/refresh");
      console.log("Access token refreshed");
    } catch (error) {
      console.error("Error refreshing access token:", error);
      queryClient.clear();
      navigate("/login", {
        state: { redirectUrl: window.location.pathname },
      });
    }
  }, 14 * 60 * 1000); // Refresh every 14 minutes (before the 15-minute expiry)
};

refreshAccessTokenPeriodically();

export default axiosInstance;
