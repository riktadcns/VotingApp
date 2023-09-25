import mongoose from "mongoose";

export const Ids = mongoose.model('Ids', new mongoose.Schema({

    UserId:{type:String, required:true, unique: true},
 
   
 
}),'Ids');
