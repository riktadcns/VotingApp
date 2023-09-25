import { VoterController } from "../controller/voters.controller.js";
import { Voter } from "../models/voters.js";


export const VoterRoute = (app) => {
//Voter Registration
app.post("/api/voter-register", async(req,res) =>
{
try{
     await VoterController.CreateVoter(req.body)
     res.status(200).send({code:200, message:"Voter Register Successfully"})
}
catch(err)
{
    res.status(500).send({code: err.code, message: err.message});
}
})
app.post("/api/verify-email", async(req,res)=>
{
    try
    {
        
        const {email,code}= req.body;
        await VoterController.verifyEmail(email, code);
        res.status(200).send({code:200, message:"Email Verification Successfully"})

    }
    catch(err){
        
        res.status(500).send({code: err.code, message: err.message})

    }

})
// Voter Login
app.post("/api/voter-login", async(req,res)=>{
    const {VoterId, VoterPassword} = req.body;
try
{    
    const accessToken = await VoterController.GenerateAccessToken(VoterId, VoterPassword);
    const voters = Voter.findOne(VoterId, VoterPassword);
     if(voters && accessToken)
    {
        res.status(200).send({token: accessToken })
    }
    else{
        res.status(404).send({code:404, message:"Voter Not Found Or Access Token Is Invalid"})
    }
}
catch(err)
{
    res.status(500).send({code: err.code, message: err.message})
}
});

//Reset Password Send

app.post("/api/send-reset-password",async(req,res) =>{
try{
    const {email} = req.body;
    await VoterController.SendresetPassword(email);
    res.status(200).send({code:200, message:"Reset Password Code Send Successfully"})

}
catch(err){
    
    res.status(500).send({code: err.code, message: err.message})
}
})

//save reset password

app.post("/api/save-reset-password", async(req,res) => {
    
    try
    {
       const {email, code, VoterPassword} = req.body;
        const result = await VoterController.SaveResetPassword(email, code, VoterPassword);
        console.log(result)
        res.status(200).send({code:200, message:"Reset Password Save Successfully"})
    }
    catch(err)
    {
        console.log(err)
        res.status(500).send({code:err.code, message: err.message})
    }
})

app.put("/api/UpdateVoter", async (req, res) => {
    try {
      await VoterController.UpdateVoter(req.params.VoterId, req.body);
      res.status(200).send({ code: 200, message: "Voter Update Successfully!" });
    } catch (err) {
      res.status(500).send({ code: err.code, message: err.message});
    }
  });

  app.delete('/api/delete-voter', async (req,res) => {
    const { VoterId, VoterName, DateOfBirth, VoterPassword } = req.body; 
    try {
      
         await VoterController.Voterdeleted(VoterId, VoterName, DateOfBirth, VoterPassword);
         res.status(200).send({ code: 200, message: 'Voter deleted successfully' });
       
    } catch (error) {
        res.status( 500).send({ code: error.code, message: error.message });
    }
});  

}