import jwt from "jsonwebtoken";
import { VoterController } from '../controller/voters.controller.js';
import { Voter } from "../models/voters.js";

export const VoterAuthorize = (roles) => {
  return async (req, res, next) => {
    try {
      const authToken = req.headers.authorization;
      if (!authToken) {
        return res.status(401).send({ code: 401, message: "Authorization token missing" });
      }
    
      const voter = jwt.verify(authToken, process.env.JWT_SECRET_KEY);
  
      if (!voter) {
        return res.status(401).send({ code: 401, message: "Invalid token" });
      }
      let existingVoter;
      if (roles.includes("voter")) {
        existingVoter = await VoterController.findById(voter.id);
        if (!existingVoter) {
          return res.status(401).send({ code: 401, message: "Voter not found" });
        }
      }
      req.voter = existingVoter; 
      next();
    } catch (err) {
      console.error(err);
      return res.status(401).send({ code: 401, message: "Authentication error" });
    }
  };
};
