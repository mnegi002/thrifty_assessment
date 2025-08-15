import express from "express";
import bodyParser from "body-parser";
import mongoose from "mongoose";

const app = express();
app.use(bodyParser.json());

// ====== MongoDB Connection ======
const MONGO_URI = "mongodb+srv://itsmemayank02:mayank02@cluster0.ek5xndf.mongodb.net/chatapp";

mongoose
  .connect(MONGO_URI, {
    useNewUrlParser: true,
    useUnifiedTopology: true
  })
  .then(() => console.log("✅ MongoDB connected"))
  .catch(err => {
    console.error("❌ MongoDB connection error:", err);
    process.exit(1);
  });

// ====== Activity Schema ======
const activitySchema = new mongoose.Schema({
  userId: { type: String, required: true },
  action: { type: String, required: true },
  timestamp: { type: Date, default: Date.now }
});

const Activity = mongoose.model("Activity", activitySchema);

// ====== Routes ======

/**
 * POST /activity
 * Body: { userId: "string", action: "string" }
 * Adds server timestamp & stores
 */
app.post("/activity", async (req, res) => {
  try {
    const { userId, action } = req.body;
    if (!userId || !action) {
      return res.status(400).json({ error: "userId and action are required" });
    }

    const newActivity = await Activity.create({ userId, action });
    res.status(201).json(newActivity);
  } catch (err) {
    console.error("POST /activity error:", err);
    res.status(500).json({ error: "Internal server error" });
  }
});

/**
 * GET /activity/:userId
 * Returns last 10 activities for the user
 */
app.get("/activity/:userId", async (req, res) => {
  try {
    const { userId } = req.params;
    const activities = await Activity.find({ userId })
      .sort({ timestamp: -1 })
      .limit(10)
      .select("action timestamp -_id");

    res.json(activities);
  } catch (err) {
    console.error("GET /activity/:userId error:", err);
    res.status(500).json({ error: "Internal server error" });
  }
});

/**
 * GET /activity/:userId/summary
 * Returns total count of each action for the user
 */
app.get("/activity/:userId/summary", async (req, res) => {
  try {
    const { userId } = req.params;
    const summary = await Activity.aggregate([
      { $match: { userId } },
      { $group: { _id: "$action", count: { $sum: 1 } } }
    ]);

    // Transform array to object
    const result = {};
    summary.forEach(item => {
      result[item._id] = item.count;
    });

    res.json(result);
  } catch (err) {
    console.error("GET /activity/:userId/summary error:", err);
    res.status(500).json({ error: "Internal server error" });
  }
});


app.get("/", (req, res) => {
  res.send("User Activity Tracking API is running with MongoDB");
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`🚀 Server running on http://localhost:${PORT}`);
});
