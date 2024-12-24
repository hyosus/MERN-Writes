import { createAccount } from "../services/authService.js";
import catchErrors from "../utils/catchErrors.js";
import { setAuthCookies } from "../utils/cookies.js";
import { loginSchema, registerSchema } from "./authSchemas.js";

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

  // Set authentication cookies and return response
  return setAuthCookies({ res, accessToken, refreshToken })
    .status(201)
    .json(user);
});

export const loginHandler = catchErrors(async (req, res) => {
  const request = loginSchema.validate({
    ...req.body,
    userAgent: req.headers["user-agent"],
  });

  const {} = await loginUser(request);
});
