import { User } from "../models/userModel.js";
import { Session } from "../models/sessionMode.js";
import { VerificationCode } from "../models/verificationCodeModel.js";
import { JWT_REFRESH_SECRET, JWT_SECRET } from "../constants/env.js";
import jwt from "jsonwebtoken";
import { omitPassword } from "../utils/password.js";

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
    userId: user._id,
    type: "EmailVerification",
    expiresAt: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000), // 7 days from now
  });

  await verificationCode.save();

  // create session
  const session = new Session({
    userId: user._id,
    userAgent: CreateAccountParams.userAgent,
  });

  await session.save(); // Save the session

  // sign access token & refresh token
  const refreshToken = jwt.sign(
    { sessionId: session._id },
    JWT_REFRESH_SECRET,
    {
      audience: ["user"],
      expiresIn: "30d",
    }
  );

  const accessToken = jwt.sign(
    {
      userId: user._id,
      sessionId: session._id,
    },
    JWT_SECRET,
    {
      audience: ["user"],
      expiresIn: "15m",
    }
  );

  // return user and token
  return {
    user: omitPassword(await User.findById(user._id)),
    refreshToken,
    accessToken,
  };
};
