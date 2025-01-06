import mongoose from "mongoose";

const verificationCodeSchema = new mongoose.Schema(
  {
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
      index: true,
    },
    type: {
      type: String,
      required: true,
      enum: ["EmailVerification", "PasswordReset"],
    },
    expiresAt: {
      type: Date,
      required: true,
    },
  },
  { timestamps: true }
);

export const VerificationCode = mongoose.model(
  "VerificationCode",
  verificationCodeSchema
);
