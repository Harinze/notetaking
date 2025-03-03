import connectToDB from "../../lib/connectToDB";
import Note from "../../models/Note";
import { withAuth } from "../../middleware/auth";

export default async function handler(req, res) {
  await connectToDB();

  const authResponse = await withAuth(req, res);
  if (!authResponse.user) return;
  const { user } = authResponse;
  
  try {
    switch (req.method) {
      case "GET": {
        const { userId } = req.query;
        if (!userId || userId !== user.userId) return res.status(403).json({ message: "Forbidden" });
        const notes = await Note.find({ userId });
        return res.status(200).json(notes);
      }

      case "POST": {
        const { note, tag } = req.body;
        if (!note) return res.status(400).json({ error: "Missing required fields" });
    
        const existingNote = await Note.findOne({ text: note, userId: user.userId });
        if (existingNote) {
            return res.status(400).json({ message: "Note already exists" });
        }
    
        const newNote = new Note({ text: note, tag, userId: user.userId });
        await newNote.save();
        return res.status(201).json({ message: "Note added successfully" });
    }
    

      case "PUT": {
        const { id, newText } = req.body;
        if (!id || !newText) return res.status(400).json({ error: "Missing required fields" });
        const updatedNote = await Note.findOneAndUpdate({ _id: id, userId: user.userId }, { text: newText }, { new: true });
        if (!updatedNote) return res.status(404).json({ message: "Note not found" });
        return res.status(200).json({ message: "Note updated successfully" });
      }

      case "DELETE": {
        const { id } = req.body;
        if (!id) return res.status(400).json({ error: "Missing required fields" });
        const deletedNote = await Note.findOneAndDelete({ _id: id, userId: user.userId });
        if (!deletedNote) return res.status(404).json({ error: "Note not found" });
        return res.status(200).json({ message: "Note deleted successfully" });
      }

      default:
        return res.status(405).json({ message: "Method not allowed" });
    }
  } catch (error) {
    console.error(error);
    return res.status(500).json({ message: "Internal server error" });
  }
}

