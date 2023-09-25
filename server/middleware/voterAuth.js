// import jwt from "jsonwebtoken";
// import {VoterController} from '../controller/voters.controller.js'
// import { Voter } from "../models/voters.js";

// export const VoterAuthorize = (roles) => {
//     return async (req, res, next) => {
//       try {
//         const authToken = req.headers.authorization;
//         if (!authToken) {
//           return res.status(401).send({ code: 401, message: "Invalid login attempt (1)" });
//         }
//         const voter = jwt.verify(token,process.env.JWT_SECRET_KEY);
  
//         if (!voter) {
//           return res.status(401).send({ code: 401, message: "Invalid login attempt (2)" });
//         }
//         let existingVoter;
//         if (roles.includes("voter")) {
//             existingVoter = await VoterController.findById(Voter.id);
//             if (!existingUser) {
//             return res.status(401).send({ code: 401, message: "Invalid login attempt for voter (4)" });
//           }
//         }
//         next();
//       } catch (err) {
//         console.log(err);
//         return res.status(401).send({ code: 401, message: err.message });
//       }
//     };
//   };