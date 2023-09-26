import jwt from "jsonwebtoken";
import { ParticipantsController } from '../controller/participants.controller.js';
import { Participants } from "../models/participants.js";

export const ParticipantAuthorize = (roles) => {
  return async (req, res, next) => {
    try {
      const authToken = req.headers.authorization;
      if (!authToken) {
        return res.status(401).send({ code: 401, message: "Authorization token missing" });
      }
      
      const participants = jwt.verify(authToken, process.env.JWT_SECRET_KEY);
  
      if (!participants) {
        return res.status(401).send({ code: 401, message: "Invalid token" });
      }
      
      let existingParticipant;
      if (roles.includes("participants")) {
        existingParticipant = await ParticipantsController.findById(participants.id);
        if (!existingParticipant) {
          return res.status(401).send({ code: 401, message: "Participant not found" });
        }
      }
      req.participant = existingParticipant;
      next();
    } catch (err) {
      console.error(err);
      return res.status(401).send({ code: 401, message: "Authentication error" });
    }
  };
};
