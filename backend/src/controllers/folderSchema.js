import Joi from "joi";

export const folderSchema = Joi.object({
  name: Joi.string().min(1).max(100).required(),
  type: Joi.string().valid("Note", "Journal").required(),
  note: Joi.string().optional().allow(null),
  journal: Joi.string().optional().allow(null),
});
