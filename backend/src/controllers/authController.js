import { Session } from "../models/sessionMode.js";
import { User } from "../models/userModel.js";
import {
  createAccount,
  forgotPassword,
  loginUser,
  refreshUserAccessToken,
  resetPassword,
  sendVerificationEmail,
  verifyEmail,
} from "../services/authService.js";
import catchErrors from "../utils/catchErrors.js";
import {
  clearAuthCookies,
  getAccessTokenCookieOptions,
  getRefreshTokenCookieOptions,
  setAuthCookies,
} from "../utils/cookies.js";
import { verifyToken } from "../utils/jwt.js";
import {
  emailSchema,
  loginSchema,
  registerSchema,
  resetPasswordSchema,
  verificationCodeSchema,
} from "./authSchemas.js";

export const registerHandler = catchErrors(async (req, res) => {
  // Validate request
  const { error, value } = registerSchema.validate({
    ...req.body,
    userAgent: req.headers["user-agent"],
  });

  if (error) {
    return res.status(400).json({ message: error.details[0].message });
  }

  // Proceed with the validated data
  const { user, refreshToken, accessToken } = await createAccount(value);

  console.log(
    "setAuthCookies: ",
    setAuthCookies({ res, accessToken, refreshToken })
  );

  // Set authentication cookies and return response
  return setAuthCookies({ res, accessToken, refreshToken })
    .status(201)
    .json(user);
});

export const loginHandler = catchErrors(async (req, res) => {
  const { error, value } = loginSchema.validate({
    ...req.body,
    userAgent: req.headers["user-agent"],
  });

  if (error) return res.status(400).json({ message: error.details[0].message });

  const { accessToken, refreshToken } = await loginUser(value);

  console.log(
    "setAuthCookies: ",
    setAuthCookies({ res, accessToken, refreshToken })
  );

  return setAuthCookies({ res, accessToken, refreshToken })
    .status(200)
    .json({ message: "Login successful" });
});

export const logoutHandler = catchErrors(async (req, res) => {
  // get access token from cookies
  const accessToken = req.cookies.accessToken;

  const { payload } = verifyToken(accessToken);

  if (payload) {
    await Session.findByIdAndDelete(payload.sessionId);
  }

  return clearAuthCookies(res)
    .status(200)
    .json({ message: "Logout successful" });
});

export const refreshHandler = catchErrors(async (req, res) => {
  const refreshToken = req.cookies.refreshToken;
  if (!refreshToken) throw new Error("No refresh token found");

  const { accessToken, newRefreshToken } = await refreshUserAccessToken(
    refreshToken
  );

  if (refreshToken) {
    res.cookie("refresh", newRefreshToken, getRefreshTokenCookieOptions);
  }

  return res
    .status(200)
    .cookie("accessToken", accessToken, getAccessTokenCookieOptions)
    .json({ message: "Access token refreshed" });
});

export const verifyEmailHandler = catchErrors(async (req, res) => {
  console.log("Req params: ", req.params);
  const { code } = req.params;
  const { error, value } = verificationCodeSchema.validate(code);
  console.log("Type: ", typeof value);

  if (error) {
    return res.status(400).json({ message: error.details[0].message });
  }

  console.log("value.code: ", value.code);
  await verifyEmail(code);

  return res.status(200).json({ message: "Email verified" });
});

export const sendVerificationEmailHandler = catchErrors(async (req, res) => {
  // get access token from cookies
  const accessToken = req.cookies.accessToken;
  const { payload } = verifyToken(accessToken);

  if (!payload) throw new Error("Unauthorised");

  const session = await Session.findById(payload.sessionId);
  const user = await User.findById(session.userId);

  console.log("Email: ", user.email);

  const { value } = verificationCodeSchema.validate(user.email);
  console.log("Value: ", value);

  console.log("Validated email: ", value);
  await sendVerificationEmail(value);

  return res.status(200).json({ message: "Verification email sent" });
});

export const forgotPasswordHandler = catchErrors(async (req, res) => {
  console.log("Req body: ", req.body);
  const { error, value } = emailSchema.validate(req.body);

  console.log("Validated email: ", value.email);
  await forgotPassword(value.email);

  return res.status(200).json({ message: "Password reset email sent" });
});

export const resetPasswordHandler = catchErrors(async (req, res) => {
  const request = resetPasswordSchema.validate(req.body);
  console.log("Request: ", request.value);
  // console.log("Request TYPE: ", typeof request);

  await resetPassword(request.value);

  return clearAuthCookies(res)
    .status(200)
    .json({ message: "Password reset successful" });
});
