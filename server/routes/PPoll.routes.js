import { PPollController } from "../controller/PPoll.controller.js";

export const PPollRoute = (app) =>
{
    
app.get('/api/participants', async (req, res) => {
    try {
        const participants = await PPollController.getParticipantsForVoting();
        res.status(200).json(participants);
    } catch (error) {
        res.status(error.code || 500).json({ message: error.message });
    }
  });
  
  app.post('/api/participants/vote', async (req, res) => {
    const { PName,POrganization } = req.body;
    try {
        const result = await PPollController.voteForParticipant(PName,POrganization);
        res.status(200).json(result);
    } catch (error) {
        res.status(error.code || 500).json({ message: error.message });
    }
  });
  

  app.get('/api/vote-count', async (req, res) => {
    try {
        const voteCount = await PPollController.getVoteCount();
        res.status(200).json(voteCount);
    } catch (error) {
        res.status(error.code || 500).json({ message: error.message });
    }
  });

}