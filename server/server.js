import express from "express";
import dotenv from "dotenv";
import mongoose from "mongoose";
import { IdsRoute } from "./routes/ids.routes.js";
import { VoterRoute } from "./routes/voters.route.js";
import { ParticipantsRoute } from "./routes/participants.route.js";
import { PPollRoute } from "./routes/PPoll.routes.js";
import cors from "cors"; 
import { fileURLToPath } from 'url';
import path from "path";
import { dirname } from "path";

const app = express();

const PORT = 8000;

app.use(express.json());

app.use(cors());

dotenv.config();

mongoose.connect(process.env.DB_URL, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  }).then(() => {
    console.log('Connection to MongoDB successful');
  }).catch((err) => {
    console.error('Connection to MongoDB failed:', err);
  });

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);
const clientDirectory = path.join(__dirname, "../client");

app.use(express.static(clientDirectory));


app.get("/", (req, res) => {
    res.sendFile(path.join(clientDirectory, "start.html"));
});


app.get("/api/IdCreate", (req, res) => {
    res.sendFile(path.join(clientDirectory, "ids.html"));
});


app.get("/api/voter-register", (req, res) => {
    res.sendFile(path.join(clientDirectory, "voterReg.html"));
});

app.get("/api/voter-login", (req, res) => {
    res.sendFile(path.join(clientDirectory, "login.html"));
});

app.get("/api/participants/vote", (req, res) => {
    res.sendFile(path.join(clientDirectory, "participants.html"));
});

app.get("/api/Participants-login", (req, res) => {
    res.sendFile(path.join(clientDirectory, "participantsLogin.html"));
});

app.get("/api/send-reset-password", (req, res) => {
    res.sendFile(path.join(clientDirectory, "resetpassword.html"));
});

IdsRoute(app);
VoterRoute(app);
ParticipantsRoute(app);
PPollRoute(app);

app.listen(PORT, () => {
    console.log(`Server is running at http://localhost:${PORT}`);
});