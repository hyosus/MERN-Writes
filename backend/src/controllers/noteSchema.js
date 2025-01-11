import Joi from "joi";

export const noteIdSchema = Joi.string().length(24);

export const noteSchema = Joi.object({
  title: Joi.string().optional().max(100),
  content: Joi.string().optional(),
  folder: Joi.string().optional().allow(null),
});
