// import jwt from "jsonwebtoken";
// import {ParticipantsController} from '../controller/participants.controller.js'
// import { Participants } from "../models/participants.js";

// export const ParticipantAuthorize = (roles) => {
//     return async (req, res, next) => {
//       try {
//         const authToken = req.headers.authorization;
//         if (!authToken) {
//           return res.status(401).send({ code: 401, message: "Invalid login attempt (1)" });
//         }
//         const participants = jwt.verify(token,process.env.JWT_SECRET_KEY);
  
//         if (!participants) {
//           return res.status(401).send({ code: 401, message: "Invalid login attempt (2)" });
//         }
//         let existingParticipants;
//         if (roles.includes("participants")) {
//             existingParticipants = await ParticipantsController.findById(Participants.id);
//             if (!existingParticipants) {
//             return res.status(401).send({ code: 401, message: "Invalid login attempt for participants (3)" });
//           }
//         }
//         next();
//       } catch (err) {
//         console.log(err);
//         return res.status(401).send({ code: 401, message: err.message });
//       }
//     };
//   };