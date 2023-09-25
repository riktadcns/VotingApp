import { IdsController } from "../controller/ids.controller.js";

export const IdsRoute = (app) =>{

    app.post("/api/IdCreate", async(req,res)=>{

        try
        {
            await IdsController.createId(req.body)
            console.log("User ID created successfully: ", req.body.UserId)
            res.status(200).send({code:200, message:"User Id Create Successfully!"})
        }
        catch(err)
        {
            res.status(500).send({code: err.code, message: err.message})
        }

    })

    app.put("/api/UpdateId", async (req, res) => {
        try {
          const { UserId, NewUserId } = req.body;
          await IdsController.UpdateId(UserId, NewUserId);
          res.status(200).send({ code: 200, message: "User Update Successfully!" });
        } catch (err) {
          res.status(err.code || 500).send({ code: err.code, message: err.message});
        }
      });

    app.delete("/api/DeleteId",async(req,res)=>
    {

        try {
            const UserIdData = req.body;
            await IdsController.DeleteId(UserIdData);
            res.status(200).send({ code: 200, message: "User Delete Successfully!" });
            }
          catch (err) {
            res.status(err.code || 500).send({ code: err.code, message: err.message});
          }

  });    

}