import Joi from "joi";

export const noteSchema = Joi.object({
  title: Joi.string().optional().max(100),
  content: Joi.string().optional(),
  folder: Joi.string().optional().allow(null),
});
