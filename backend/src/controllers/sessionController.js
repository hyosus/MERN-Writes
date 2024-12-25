import { Session } from "../models/sessionMode.js";
import catchErrors from "../utils/catchErrors.js";

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
