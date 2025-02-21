import mongoose from "mongoose";

const SessionSchema = new mongoose.Schema({
  userId: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
  sessionToken: { type: String, required: true, unique: true },
  lastActivity: { type: Date, default: Date.now },
  expiresAt: { type: Date, required: true },
});

export default mongoose.models.Session || mongoose.model("Session", SessionSchema);
