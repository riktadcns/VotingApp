import mongoose from "mongoose";

export const Voter = mongoose.model('Voter', new mongoose.Schema({

VoterId: {type: String, required: true},
VoterName: {type:String, required:true},
DateOfBirth: {type:Date, required:true},
email:{type:String, require:true},
VoterPassword: {type:String, required:true},
tokens: {
    emailVerification: { type: String },
    ResetPassword: { type: String },
  },
}),'voter');