import Joi from "joi";
import emojiRegex from "emoji-regex";

// Get the emoji regex without the global flag
const regex = new RegExp(emojiRegex().source);

export const moodSchema = Joi.object({
  name: Joi.string().max(100).required(),
  emoji: Joi.string().pattern(regex).max(2).required(),
  colour: Joi.string().required(),
  isCustom: Joi.boolean().optional(),
  userId: Joi.string().length(24).optional(),
});
