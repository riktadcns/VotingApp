import mongoose from "mongoose";

export const PPoll = mongoose.model('PPoll', new mongoose.Schema({

PName: {type:String, required:true},
POrganization: {type:String, required:true},
votes: { type: Number, default: 0 }

}),'PPoll');