import Joi from "joi";

export const emailSchema = Joi.string().email().min(1).max(255).required();
const passwordSchema = Joi.string().min(8).max(255).required();

export const loginSchema = Joi.object({
  email: emailSchema,
  password: passwordSchema,
  userAgent: Joi.string().optional(),
});

export const registerSchema = loginSchema
  .keys({
    confirmPassword: Joi.string().min(8).max(255),
  })
  .custom((value, helper) => {
    if (value.password !== value.confirmPassword) {
      return helper.message("Passwords do not match");
    }
    return value;
  }, "Password Match Validation");

export const verificationCodeSchema = Joi.string().min(1).max(24);

export const resetPasswordSchema = Joi.object({
  password: passwordSchema,
  verificationCode: verificationCodeSchema,
});
