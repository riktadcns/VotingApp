import mongoose from "mongoose";

export const Participants = mongoose.model('Participants', new mongoose.Schema({

PId: {type: String, required: true},
PName: {type:String, required:true},
POrganization: {type:String, required:true},
Ppassword: {type:String, required:true},

}),'participants');