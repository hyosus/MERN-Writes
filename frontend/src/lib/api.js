import axiosInstance from "./axios";

export const login = async ({ email, password }) => {
  try {
    const response = await axiosInstance.post("/auth/login", {
      email,
      password,
    });
    return response;
  } catch (error) {
    throw new Error(error.response?.data?.message || "Login failed");
  }
};

export const register = async (data) => {
  try {
    const response = await axiosInstance.post("/auth/register", data);
    return response;
  } catch (error) {
    throw new Error(error.response?.data?.message || "Registration failed");
  }
};
