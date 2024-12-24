import Joi from "joi";

const emailSchema = Joi.string().email().min(1).max(255).required();
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

export const verificationSchema = Joi.object({
  code: Joi.string().min(1).max(24).required(),
});
