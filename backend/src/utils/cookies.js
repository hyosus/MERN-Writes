const secure = process.env.NODE_ENV === "production";

const defaults = {
  sameSite: "Strict",
  httpOnly: true,
  secure: secure,
};

const getAccessTokenCookieOptions = () => ({
  ...defaults,
  expires: new Date(Date.now() + 15 * 60 * 1000), // 15 minutes
});

const getRefreshTokenCookieOptions = () => ({
  ...defaults,
  expires: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000), // 30 days
  path: "/auth/refresh",
});

export const setAuthCookies = ({ res, accessToken, refreshToken }) => {
  res
    .cookie("accessToken", accessToken, getAccessTokenCookieOptions)
    .cookie("refreshToken", refreshToken, getRefreshTokenCookieOptions);

  return res;
};
