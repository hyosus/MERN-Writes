import { User } from "../models/userModel.js";
import { Session } from "../models/sessionMode.js";
import { VerificationCode } from "../models/verificationCodeModel.js";
import { JWT_REFRESH_SECRET, JWT_SECRET } from "../constants/env.js";
import jwt from "jsonwebtoken";
import { omitPassword } from "../utils/password.js";
import { refreshTokenOptions, signToken } from "../utils/jwt.js";

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

  // create verification email
  const verificationCode = new VerificationCode({
    userId,
    type: "EmailVerification",
    expiresAt: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000), // 7 days from now
  });

  await verificationCode.save();

  // create session
  const session = new Session({
    userId,
    userAgent: CreateAccountParams.userAgent,
  });

  await session.save(); // Save the session

  // sign access token & refresh token
  const refreshToken = signToken(
    { sessionId: session._id },
    JWT_REFRESH_SECRET,
    refreshTokenOptions
  );

  const accessToken = signToken({
    userId,
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
    userId,
  });

  //return user and token
  return { user: omitPassword(user), refreshToken, accessToken };
};
