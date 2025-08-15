
import express from "express";
import http from "http";
import { Server } from "socket.io";
import cors from "cors";
import { v4 as uuid } from "uuid";
import mongoose from "mongoose";

// --- MongoDB ---
mongoose.connect(
  "mongodb+srv://itsmemayank02:mayank02@cluster0.ek5xndf.mongodb.net/chatapp",
  { useNewUrlParser: true, useUnifiedTopology: true }
).then(() => console.log("MongoDB connected"))
 .catch(err => console.error("MongoDB error:", err));

// --- Schema ---
const messageSchema = new mongoose.Schema({
  id: String,
  userId: String,
  name: String,
  text: String,
  sentiment: String,
  createdAt: Date
});
const Message = mongoose.model("Message", messageSchema);

const app = express();
const server = http.createServer(app);
const io = new Server(server, {
  cors: { origin: "http://localhost:5173", methods: ["GET", "POST"] }
});

app.use(cors());
app.use(express.json());

// track userId -> name
const userNamesById = new Map();

// sentiment
const POS_WORDS = new Set(["happy", "love", "great", "awesome", "amazing", "good", "fantastic"]);
const NEG_WORDS = new Set(["sad", "angry", "bad", "terrible", "awful", "hate"]);
const classify = (t="")=>{
  const words = t.toLowerCase().match(/\b[a-z']+\b/g) || [];
  let pos=0, neg=0;
  for (const w of words){ if (POS_WORDS.has(w)) pos++; if (NEG_WORDS.has(w)) neg++; }
  if (pos>neg) return "positive";
  if (neg>pos) return "negative";
  return "neutral";
};

// socket events
io.on("connection", (socket) => {
  console.log("User connected", socket.id);

  socket.on("join", ({ userId, name }) => {
    if (userId && name) {
      userNamesById.set(userId, name);
      io.emit("systemMessage", `${name} joined the chat`); // string only
    }
  });

  socket.on("disconnect", () => {
    console.log("User disconnected", socket.id);
  });
});

// POST /message
app.post("/message", async (req, res) => {
  const { userId, text } = req.body || {};
  if (!userId || typeof text !== "string") {
    return res.status(400).json({ error: "userId and text are required" });
  }

  const name = userNamesById.get(userId) || "Anonymous";
  const msg = new Message({
    id: uuid(),
    userId,
    name,
    text,
    sentiment: "pending",
    createdAt: new Date()
  });

  await msg.save();

  // broadcast pending immediately
  io.emit("message", msg.toObject());

  // async "analysis"
  setTimeout(async () => {
    const sentiment = classify(text);
    await Message.updateOne({ id: msg.id }, { sentiment });
    io.emit("sentimentUpdate", { id: msg.id, sentiment });
  }, 3000);

  res.status(201).json(msg);
});

// (We keep GET /messages for admin/debug, but the client will not call it)
app.get("/messages", async (_req, res) => {
  const msgs = await Message.find().sort({ createdAt: 1 });
  res.json(msgs);
});

const PORT = process.env.PORT || 3001;
server.listen(PORT, () => console.log(`Server running on http://localhost:${PORT}`));
