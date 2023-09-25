import { PPoll } from "../models/PPoll.model.js";
import { Participants } from "../models/participants.js";

export const PPollController = {

    getParticipantsForVoting: async () => {
        
        await PPoll.deleteMany({});
        
        const participants = await Participants.find().select('PName POrganization').exec();
        const participantsForPPoll = participants.map(participant => ({
            PName: participant.PName,
            POrganization: participant.POrganization,
            votes: 0 
        }));

        return PPoll.insertMany(participantsForPPoll);
    },
    
    voteForParticipant: async (PName, POrganization) => {
        const participant = await PPoll.findOne({ PName, POrganization }).exec();
        if (!participant) {
            throw { code: 404, message: 'Participant not found' };
        }
        participant.votes += 1;
        await participant.save();
        return { message: 'Vote cast successfully' };
    },
    
    getVoteCount: async () => {
        return PPoll.find().select('PName POrganization votes').exec();
    },
}

