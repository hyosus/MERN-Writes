import dotenv from "dotenv";

dotenv.config();

const secure = process.env.NODE_ENV === "production";

export const REFRESH_PATH = "/auth/refresh";

const defaults = {
  sameSite: "Strict",
  httpOnly: true,
  secure: secure,
};

export const getAccessTokenCookieOptions = () => ({
  ...defaults,
  expires: new Date(Date.now() + 15 * 60 * 1000), // 15 minutes
});

export const getRefreshTokenCookieOptions = () => ({
  ...defaults,
  expires: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000), // 30 days
  path: REFRESH_PATH,
});

export const setAuthCookies = ({ res, accessToken, refreshToken }) => {
  res
    .cookie("accessToken", accessToken, getAccessTokenCookieOptions)
    .cookie("refreshToken", refreshToken, getRefreshTokenCookieOptions);

  return res;
};

export const clearAuthCookies = (res) => {
  res.clearCookie("accessToken").clearCookie("refreshToken", {
    path: REFRESH_PATH,
  });

  return res;
};
