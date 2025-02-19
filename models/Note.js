import mongoose from "mongoose";

const NoteSchema = new mongoose.Schema({
  text: { type: String, required: true },
  tag: { type: String, default: "General" },
  timestamp: { type: Date, default: Date.now },
});

export default mongoose.models.Note || mongoose.model("Note", NoteSchema);
