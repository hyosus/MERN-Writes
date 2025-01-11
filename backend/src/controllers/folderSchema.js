import Joi from "joi";

export const folderIdSchema = Joi.string().length(24);

export const folderSchema = Joi.object({
  name: Joi.string().min(1).max(100).required(),
  type: Joi.string().valid("Note", "Journal").required(),
  note: Joi.array().items(Joi.string()).optional().allow(null),
  journal: Joi.array().items(Joi.string()).optional().allow(null),
});
