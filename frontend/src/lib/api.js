import axiosInstance from "./axios";

export const getUser = async () => {
  try {
    const response = await axiosInstance.get("/user");
    return response;
  } catch (error) {
    throw new Error(error.response?.data?.message || "Failed to get user");
  }
};

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

export const verifyEmail = async (code) => {
  try {
    const response = await axiosInstance.get(`/auth/verify-email/${code}`);
    return response;
  } catch (error) {
    throw new Error(error.response?.data?.message || "Verification failed");
  }
};

export const resendVerificationEmail = async () => {
  try {
    const response = await axiosInstance.post(`/auth/send-verification-email`);
    return response;
  } catch (error) {
    throw new Error(
      error.response?.data?.message || "Failed to resend verification email"
    );
  }
};

export const sendResetPasswordEmail = async (email) => {
  try {
    const response = await axiosInstance.post("/auth/forgot-password", {
      email,
    });

    return response;
  } catch (error) {
    throw new Error(
      error.response?.data?.message || "Failed to send reset password email"
    );
  }
};

export const resetPassword = async ({ verificationCode, password }) => {
  try {
    const response = await axiosInstance.post("/auth/reset-password", {
      verificationCode,
      password,
    });
    return response;
  } catch (error) {
    throw new Error(
      error.response?.data?.message || "Failed to reset password"
    );
  }
};
