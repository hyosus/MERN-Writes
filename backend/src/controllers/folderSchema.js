import Joi from "joi";

export const folderSchema = Joi.object({
  name: Joi.string().min(1).max(100).required(),
  type: Joi.string().valid("Note", "Journal").required(),
  colour: Joi.string().optional().allow(null),
  note: Joi.array().items(Joi.string()).optional().allow(null),
  journal: Joi.array().items(Joi.string()).optional().allow(null),
});
