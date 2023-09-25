import { Ids } from "../models/ids.js";

export const IdsController = {

    createId: async(data) =>{
        const isUse = await Ids.findOne({UserId: data.UserId}).exec();
        if(isUse)
        {
        throw({code:409, messsage:"User Id Already Exist"});
        }
        if(!data.UserId)
        {
        throw({code:400,message:"UserId Required"});
        }
        const newIds = new Ids({

            UserId: data.UserId
    
    })
        console.log(newIds)
        newIds.save().catch((err) => {
            console.error(err);
            throw {code:500, message:"Faild To Save Id"}
        })

    },

    UpdateId: async (UserId, NewUserId) => {
        try {
          const existingId = await Ids.findOne({ UserId });
          
          if (!existingId) {
            throw { code: 404, message: `User Id Not Found For Update ${UserId}` };
          }
      
          if (NewUserId.UserId) {
            existingId.UserId = NewUserId.UserId;
          }
       
          existingId.UserId = NewUserId;
          const updatedId = await existingId.save();
          return updatedId;
        } catch (err) {
          throw ({ code: err.code, message: err.message });
        }
      },
      

      DeleteId: async (UserIdData) => {
        const { UserId } = UserIdData;
        try {
          const IdDelete = await Ids.findOneAndDelete({ UserId });
          if (!IdDelete) {
            throw { code: 404, message: `User Id Not Found For Delete: ${UserId}` };
          }
          return true;
        } catch (err) {
          throw { code: err.code, message: err.message };
        }
      }
      

    }
