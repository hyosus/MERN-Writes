import { User } from "../models/userModel.js";
import catchErrors from "../utils/catchErrors.js";
import { omitPassword } from "../utils/password.js";

export const getUserHandler = catchErrors(async (req, res) => {
  const user = await User.findById(req.userId);

  if (!user) throw new Error("User not found");

  return res.status(200).json(omitPassword(user));
});
