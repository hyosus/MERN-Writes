import { User } from "../models/userModel.js";
import { Session } from "../models/sessionMode.js";
import { VerificationCode } from "../models/verificationCodeModel.js";
import { APP_ORIGIN } from "../constants/env.js";
import { omitPassword } from "../utils/password.js";
import { refreshTokenOptions, signToken, verifyToken } from "../utils/jwt.js";
import mongoose from "mongoose";
import { sendEmail } from "../utils/sendEmail.js";
import {
  getPasswordResetTemplate,
  getVerifyEmailTemplate,
} from "../utils/emailTemplates.js";
import {
  fiveMinutesAgo,
  oneHourFromNow,
  sevenDaysFromNow,
  thirtyDaysFromNow,
} from "../utils/date.js";
import bcrypt from "bcrypt";

export const createAccount = async (CreateAccountParams) => {
  // verify existing user doesnt exist
  const existingUser = await User.exists({ email: CreateAccountParams.email });

  if (existingUser) throw new Error("User already exists");

  // create user
  const user = new User({
    email: CreateAccountParams.email,
    password: CreateAccountParams.password,
  });

  await user.save();

  // create verification code
  const verificationCode = new VerificationCode({
    userId: user._id,
    type: "EmailVerification",
    expiresAt: sevenDaysFromNow(), // 7 days from now
  });

  await verificationCode.save();

  // send verification email
  const url = `${APP_ORIGIN}/api/auth/verify-email/${verificationCode._id}`;
  await sendEmail({
    to: user.email,
    ...getVerifyEmailTemplate(url),
  });

  // if (error) console.log("Error sending email: ", error);

  // create session
  const session = new Session({
    userId: user._id,
    userAgent: CreateAccountParams.userAgent,
  });

  await session.save(); // Save the session

  // sign access token & refresh token
  const refreshToken = signToken(
    { sessionId: session._id },
    refreshTokenOptions
  );

  const accessToken = signToken({
    userId: user._id,
    sessionId: session._id,
  });

  // return user and token
  return {
    user: omitPassword(user),
    refreshToken,
    accessToken,
  };
};

export const loginUser = async (LoginUserParams) => {
  const { email, password, userAgent } = LoginUserParams.value;

  // get user by email
  const user = await User.findOne({ email: email });

  console.log(user);

  if (!user) throw new Error("Invalid email");

  // validate password from request
  const isValid = await user.comparePassword(password);
  if (!isValid) throw new Error("Invalid password");

  // create a session
  const userId = user._id;
  const session = new Session({
    userId,
    userAgent,
  });

  await session.save();

  const sessionInfo = {
    sessionId: session._id,
  };

  // sign access token & refresh token
  const refreshToken = signToken(sessionInfo, refreshTokenOptions);

  const accessToken = signToken({
    ...sessionInfo,
    userId: user._id,
  });

  //return user and token
  return { user: omitPassword(user), refreshToken, accessToken };
};

export const refreshUserAccessToken = async (refreshToken) => {
  const { payload, error } = verifyToken(refreshToken, {
    secret: refreshTokenOptions.secret,
  });

  if (!payload) throw new Error("Invalid refresh token");

  const session = await Session.findById(payload.sessionId);
  const now = Date.now();
  if (!session || session.expiresAt.getTime() < now)
    throw new Error("Session expired");

  // refresh session if it expires in the next 24hrs
  const sessionNeedRefresh =
    session.expiresAt.getTime() - now <= 24 * 60 * 60 * 1000;

  if (sessionNeedRefresh) {
    session.expiresAt = thirtyDaysFromNow();
    await session.save();
  }

  // new refresh token
  const newRefreshToken = sessionNeedRefresh
    ? signToken({ sessionId: session._id }, refreshTokenOptions)
    : undefined;

  const accessToken = signToken({
    userId: session.userId,
    sessionId: session._id,
  });

  return {
    accessToken,
    newRefreshToken,
  };
};

export const verifyEmail = async (code) => {
  // Convert the code to an ObjectId
  const objectId = new mongoose.Types.ObjectId(`${code}`); // use string interpolation to make sure it is a string

  const verificationCode = await VerificationCode.findById(objectId);

  console.log("Verify email code: ", code);

  if (!verificationCode) {
    throw new Error("Invalid or expired verification code");
  }

  // Proceed with the email verification logic
  // For example, mark the user as verified
  const user = await User.findById(verificationCode.userId);
  if (!user) {
    throw new Error("User not found");
  }

  user.verified = true;
  await user.save();

  // Optionally, delete the verification code after successful verification
  await VerificationCode.findByIdAndDelete(verificationCode._id);

  return user;
};

export const forgotPassword = async (email) => {
  // get user by email
  const user = await User.findOne({ email });
  if (!user) throw new Error("Invalid email");

  // check email rate limit
  const fiveMinsAgo = fiveMinutesAgo();
  const count = await VerificationCode.countDocuments({
    userId: user._id,
    type: "EmailVerification",
    createdAt: { $gt: fiveMinsAgo },
  });

  if (count >= 1) throw new Error("Email rate limit exceeded");

  // create verification code
  const expiresAt = oneHourFromNow();
  const verificationCode = new VerificationCode({
    userId: user._id,
    type: "PasswordReset",
    expiresAt,
  });

  await verificationCode.save();

  // send password reset email
  const url = `${APP_ORIGIN}/api/auth/reset-password?code=${
    verificationCode._id
  }&exp=${expiresAt.getTime()}`;

  await sendEmail({
    to: user.email,
    ...getPasswordResetTemplate(url),
  });

  return url;
};

export const resetPassword = async ({ verificationCode, password }) => {
  console.log("Valid code: ", verificationCode);
  // verify code
  const validCode = await VerificationCode.findOne({
    _id: verificationCode,
    type: "PasswordReset",
    expiresAt: { $gt: new Date() },
  });

  if (!validCode) throw new Error("Invalid or expired verification code");

  // get user and update password
  const salt = await bcrypt.genSalt(10);
  const updatedUser = await User.findByIdAndUpdate(validCode.userId, {
    password: await bcrypt.hash(password, salt),
  });

  if (!updatedUser) throw new Error("User not found");

  //delete verification code
  await validCode.deleteOne();

  // delete all session so they have to login on every device again
  await Session.deleteMany({ userId: updatedUser.userId });

  return omitPassword(updatedUser);
};
