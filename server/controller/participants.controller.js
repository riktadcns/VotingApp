import jwt from "jsonwebtoken";
import dotenv from "dotenv";
import { Participants } from "../models/participants.js";


dotenv.config();

export const ParticipantsController = { 
  

    findParticipants: async(filter)=>{
      if (!filter) {
          throw { code: 409, message: "Required parameter: filter" };
        }
        return Participants.findOne(filter).exec();
     },
  
    GenerateAccessToken: async(PId,Ppassword) => {

      console.log('Generating access token for PId:', PId);

      if(!PId)
      {
        throw({code:404, message:"Invalid Participants Id"})
      }
      if(!Ppassword)
      {
        throw({code:404, message:"Invalid Participants Password"})
      }
      const ParticipantsExists = await ParticipantsController.findParticipants({PId: PId });
      console.log('Generating access token for PId:', ParticipantsExists);
      if(!ParticipantsExists)
      {
        throw({code:400, message:"Participants Does Not Exist"})
      }

      const responsToken = {
        id: ParticipantsExists._id,
        PId: ParticipantsExists.PId,
        PName: ParticipantsExists.PName,
      }

      const acessToken = jwt.sign( responsToken , process.env.JWT_SECRET_KEY,
        {
            expiresIn : '1h'
        })

        return ({message: "Login Successfully", PId: ParticipantsExists.PId, acessToken: acessToken })
    
      },
  
    UpdateParticipants: async(PId,newParticipants)=>{

      try{
        const ExistingPId = await Participants.findOne({PId: newParticipants.PId})
        if(!ExistingPId)
        {
          throw({code:404, message:`Participants Not Found With This Id ${PId}`})
        }
        if (newParticipants.PId) {
          ExistingPId.PId = newParticipants.PId;
        }
        if (newParticipants.PName) {
        ExistingPId.PName = newParticipants.PName;
        }
        if (newParticipants.POrganization) {
        ExistingPId.POrganization = newParticipants.POrganization;
        }
        if (newParticipants.Ppassword) {
        ExistingPId.Ppassword = newParticipants.Ppassword;
        }
  
      const updatedParticipants = await ExistingPId.save();
      return updatedParticipants;
  }
   catch (err) 
      {
       throw { code:500, message: err.message };
      }
},

DeleteParticipants: async (ParticipantsData) => {
  const { PId, PName, POrganization, Ppassword } = ParticipantsData; 
  try {
      const ParticipantsToDelete = await Participants.findOneAndDelete(PId, PName, POrganization, Ppassword);
      console.log('ParticipantsData:', ParticipantsData);     
      if (!ParticipantsToDelete) {
          throw { code: 404, message: 'Participants not found with provided information '};
      }
      return true; 
  } catch (err) {
      throw { code: err.code , message: err.message };
  }
},  

}
