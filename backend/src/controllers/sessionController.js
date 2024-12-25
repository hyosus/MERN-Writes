import Joi from "joi";
import { Session } from "../models/sessionMode.js";
import catchErrors from "../utils/catchErrors.js";
import mongoose from "mongoose";

export const getSessionHandler = catchErrors(async (req, res) => {
  const sessions = await Session.find(
    {
      userId: req.userId,
      expiresAt: { $gt: new Date() },
    },
    {
      _id: 1,
      userAgent: 1,
      createdAt: 1,
    },
    {
      sort: { createdAt: -1 },
    }
  );

  return res.status(200).json(
    sessions.map((session) => ({
      ...session.toJSON(), // convert each session into JS object
      ...(session.id === req.sessionId && { isCurrent: true }), // add isCurrent property to the current session
    }))
  );
});

export const deleteSessionHandler = catchErrors(async (req, res) => {
  const sessionId = Joi.string().validate(req.params.id);

  // convert to ObjectId
  const sessionObjectId = new mongoose.Types.ObjectId(`${sessionId.value}`);

  const deleted = await Session.findOneAndDelete({
    _id: sessionObjectId,
    userId: req.userId,
  });

  if (!deleted) throw new Error("Session not found");

  return res.status(200).json({ message: "Session deleted" });
});
