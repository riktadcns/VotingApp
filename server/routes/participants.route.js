import { ParticipantsController } from "../controller/participants.controller.js";
import { Participants } from "../models/participants.js";


export const ParticipantsRoute = (app) => {

// Participants Login
app.post("/api/Participants-login", async(req,res)=>{
    const {PId, Ppassword} = req.body;
try
{    
    const accessToken = await ParticipantsController.GenerateAccessToken(PId, Ppassword);
    const Participant = Participants.findOne(PId, Ppassword);
     if(Participant && accessToken)
    {
        res.status(200).send({token: accessToken })
    }
    else{
        res.status(404).send({code:404, message:"Participant Not Found Or Access Token Is Invalid"})
    }
}
catch(err)
{
    res.status(500).send({code: err.code, message: err.message})
}
});

// Participants Update

app.put("/api/Update-Participants", async (req, res) => {
    try {
      await ParticipantsController.UpdateParticipants(req.params.PId, req.body);
      res.status(200).send({ code: 200, message: "Participant Update Successfully!" });
    } catch (err) {
      res.status(500).send({ code: err.code, message: err.message});
    }
  });

  // Participants delete
  
  app.delete('/api/delete-Participants', async (req,res) => {
    const { PId, PName, POrganization, Ppassword } = req.body; 
    try {
      
         await ParticipantsController.DeleteParticipants(PId, PName, POrganization, Ppassword);
         res.status(200).send({ code: 200, message: 'Participant deleted successfully' });
       
    } catch (error) {
        res.status( 500).send({ code: error.code, message: error.message });
    }
});  

}