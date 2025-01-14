import Joi from "joi";

export const journalIdSchema = Joi.string().length(24);

export const journalSchema = Joi.object({
  title: Joi.string().optional().max(100),
  content: Joi.string().optional(),
  mood: Joi.string().optional(),
  folder: Joi.string().optional().allow(null),
  date: Joi.date().required(),
});
