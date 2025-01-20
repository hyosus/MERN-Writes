import Joi from "joi";

// Define a regular expression for the date format YYYY-MM-DD
const dateRegex = /^\d{4}-\d{2}-\d{2}$/;

export const journalDateSchema = Joi.string().pattern(dateRegex);

export const journalIdSchema = Joi.string().length(24);

export const journalSchema = Joi.object({
  title: Joi.string().optional().max(100),
  content: Joi.string().optional(),
  mood: Joi.array().items(Joi.string()).optional(),
  folders: Joi.array().items(Joi.string()).optional().allow(null),
  date: Joi.string().pattern(dateRegex).required(), // YYYY-MM-DD pattern
});
