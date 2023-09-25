import {Voter} from "../models/voters.js";
import { Ids } from "../models/ids.js";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import dotenv from "dotenv";
import  crypto from "crypto";
import nodemailer from "nodemailer";

dotenv.config();

export const VoterController = { 

  //Create Voter, Eligibility check and send email
    CreateVoter: async (data) => {  
        const idExists = await Ids.findOne({ UserId: data.VoterId}).exec(); 
  
        if (!idExists) {
          throw { code: 404, message: "Voter ID does not exist." };     
        }
  
        const voterExists = await Voter.findOne({ VoterId: data.VoterId }).exec(); 
  
        if (voterExists) {
          throw { code: 409, message: "Voter Already Exist." };
        }

        const emailExist = await Voter.findOne({email: data.email}).exec();
        if(emailExist)
        {
          throw({code:409, message:"Email Alredy Exist"})
        }

        if(!data.email)
        {
          throw({code:400, message:"Voter Email required"})
        }

        if(!data.VoterName)
        {
            throw({code:400, message: "Voter Name Is Required"})
        }
        if(!data.DateOfBirth)

        {
            throw({code:400, message:"Date Of Birth Is Required"})

        }
        if(!data.VoterPassword)
        {
            throw({code:400, message:"Voter Password Is Required"})
        }

        const Birthdate = data.DateOfBirth;
        const dob = new Date(Birthdate);

        if (isNaN(dob.getTime())) {
        throw { code: 400, message: "Invalid date of birth format." };
        }
        const currentDate = new Date();
        const age = currentDate.getFullYear() - dob.getFullYear();
        if (age < 18) {
        throw { code: 400, message: "Voter Is Not Eligible To Register." };
        }
      
        const passwordsalt = await bcrypt.genSalt();
        const encryptedPassword = await bcrypt.hash(data.VoterPassword, passwordsalt);
        const emailVerificationCode = await crypto.randomBytes(4).toString('hex');

        const newVoter = new Voter({
        VoterId: data.VoterId,
        VoterName: data.VoterName,
        DateOfBirth: age,
        email: data.email,
        VoterPassword: encryptedPassword,
        emailverification: false,
        tokens:{
          emailVerification:emailVerificationCode,
        },      
      });
    
      console.log(newVoter)
      newVoter.save().catch((err) => {
          console.error(err);
          throw { code: 500, message: "Failed to save user" };
      });
      const transporter = nodemailer.createTransport({
        host: process.env.SMTP_HOST,
        port: process.env.SMTP_PORT,
        secure: true,
        auth: {
            user: process.env.SMTP_CLIENTID,
            pass: process.env.SMTP_CLIENTSECRET,
        },
    });
    try {
        await transporter.sendMail({
            from: `'Codenet Softwares' <${process.env.SMTP_SENDER}>`,
            to: data.email,
            subject: "Verify Your Email",
            text: `Your Verification Code Is ${emailVerificationCode}`,
        });
        console.log('Email Sent Successfully');
    } catch (err) {
        console.error(err);
        throw { code: 500, message: "Failed to send verification email" };
    }
    return true;  
  },
 
  //verify email

  verifyEmail: async(email,code) =>
  {
    console.log(email)
    console.log(code)
    const emalilverify = await Voter.findOne({email: email})

    console.log(emalilverify)

    if(!emalilverify)
    {
      throw({code: 404, message:`Email Does Not Match ${email}`});
    }
    if(emalilverify.tokens.emailVerification !== code)
    {
     throw({code:404, message:`Verification Code Does Not Match ${code}`});
    }

   emalilverify.tokens.emailVerification = null;
   emalilverify.emailVerification = true;
   emalilverify.save().catch((err)=>{
    console.log(err)
    throw({code:500, message:"Faild To Verify Email"})

   })
  },

  // login with access token
  
  GenerateAccessToken: async(VoterId, VoterPassword) => {

    if(!VoterId)
    {
      throw({code:404, message:"Invalid Voter Id"})
    }
    if(!VoterPassword)
    {
      throw({code:404, message:"Invalid Voter Password"})
    }
    const voterExists = await Voter.findOne({VoterId: VoterId});

    if(!voterExists)
    {
      throw({code:400, message:"Voter Does Not Exist"})
    }

    const VoterPasswordValid = await bcrypt.compare(VoterPassword, voterExists.VoterPassword);
    if (!VoterPasswordValid) {
    throw { code: 401, message: ' Voter Password Is Invalid' };
  }

    const responsToken = {
      id: voterExists._id,
      VoterId: voterExists.VoterId,
      VoterName: voterExists.VoterName,
    }

    const acessToken = jwt.sign( responsToken , process.env.JWT_SECRET_KEY,
      {
          expiresIn : '1h'
      })

      return ({message: "Login Successfully", VoterId: voterExists.VoterId, acessToken: acessToken })
  
  },

  //send reset password to email

    SendresetPassword: async(email) =>{

      const checkEmail = await Voter.findOne({email: email}).exec();

      if(!checkEmail)
      {
        throw({code:400, message: "Email Does Not Match"})
      }
      const resetCode = await crypto.randomBytes(4).toString("hex");
            checkEmail.tokens.ResetPassword = resetCode;
            checkEmail.save().catch((err) => {
            console.error(err);
            throw { code: 500, message: "Failed to save new password" };
        });
      
      const transporter = nodemailer.createTransport({
        host: process.env.SMTP_HOST,
        port: process.env.SMTP_PORT,
        secure: true,
        auth: {
            user: process.env.SMTP_CLIENTID,
            pass: process.env.SMTP_CLIENTSECRET,
        },
    });
    try {
        await transporter.sendMail({
            from: `'Codenet Softwares' <${process.env.SMTP_SENDER}>`,
            to: email,
            subject: "Reset Your Password",
            text: `Your Reset Password Code Is ${resetCode}`,
        });
         console.log('Email Sent Successfully');
    } catch (err) {
        console.error(err); 
        throw { code: 500 || err.code, message: "Failed To Send Reset Password Code" || err.code };
    }
    
      return checkEmail;
    },


    // save reset password
    SaveResetPassword: async(email,code,VoterPassword) =>{
  try {
  
  const CheckVoter = await Voter.findOne({email: email}).exec();
      
  if (!CheckVoter) {
    throw { code: 404, message: "Voter Not Found" };
  }
 
  if (CheckVoter.tokens.ResetPassword !== code) {

    throw { code: 404, message: "Reset Code Does Not Match" };
   
  }
  
 const isSamePassword = await bcrypt.compare(VoterPassword, CheckVoter.VoterPassword);
 if (isSamePassword) {
 throw { code: 400, message: "New password cannot be the same as the old password." };
  } 
 const passwordsalt = await bcrypt.genSalt();
 const encryptedPassword = await bcrypt.hash(VoterPassword, passwordsalt)

 CheckVoter.VoterPassword = encryptedPassword;
 await CheckVoter.save();
 return true;

  
} catch (error) {
  console.log(error);
  throw { code: 500 || err.code, message: "Failed To Save Reset Password Code" || err.code };

}

},

    //update voter info

    UpdateVoter : async(VoterId,newVoter)=>{

   try{
        const ExistingVoterId = await Voter.findOne({VoterId: newVoter.VoterId})
        if(!ExistingVoterId)
        {
          throw({code:404, message:`Voter Not Found With This Id ${VoterId}`})
        }
        if (newVoter.VoterId) {
          ExistingVoterId.VoterId = newVoter.VoterId;
      }
      if (newVoter.VoterName) {
        ExistingVoterId.VoterName = newVoter.VoterName;
      }
      if (newVoter.DateOfBirth) {
        ExistingVoterId.DateOfBirth = newVoter.DateOfBirth;
      }
      if (newVoter.VoterPassword) {
        ExistingVoterId.VoterPassword = newVoter.VoterPassword;
      }
  
      const updatedVoter = await ExistingVoterId.save();
      return updatedVoter;
  }
   catch (err) 
      {
       throw { code:500, message: err.message };
       
      }
},

//delete voter info

Voterdeleted: async (voterData) => {
  const { VoterId, VoterName, DateOfBirth, VoterPassword } = voterData; 
  try {
      const voterToDelete = await Voter.findOneAndDelete(VoterId, VoterName, DateOfBirth, VoterPassword );
      console.log('voterData:', voterData);     
      if (!voterToDelete) {
          throw { code: 404, message: 'Voter not found with provided information '};
      }
      return true; 
  } catch (err) {
      throw { code: err.code , message: err.message };
  }
},  

}

     
  


