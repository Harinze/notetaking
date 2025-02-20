import connectToDB from "../../lib/connectToDB";
import Note from "../../models/Note";

export default async function handler(req, res) {
  try {
    await connectToDB();

    switch (req.method) {
      case "GET": {
        const { userId } = req.query;
        if (!userId) return res.status(400).json({ error: "User ID is required" });

        const notes = await Note.find({ userId }).sort({ timestamp: -1 });
        return res.status(200).json(notes);
      }

      case "POST": {
        const { note, tag, userId } = req.body;
        if (!note || !userId) return res.status(400).json({ error: "Note and User ID are required" });

        const newNote = await Note.create({ text: note, tag, userId, timestamp: Date.now() });
        return res.status(201).json(newNote);
      }

      case "PUT": {
        const { id, newText, userId } = req.body;
        if (!id || !newText || !userId) return res.status(400).json({ error: "Invalid input" });

        const updatedNote = await Note.findOneAndUpdate(
          { _id: id, userId },
          { text: newText, timestamp: Date.now() },
          { new: true, runValidators: true }
        );

        if (!updatedNote) return res.status(404).json({ error: "Note not found or unauthorized" });
        return res.status(200).json(updatedNote);
      }

      case "DELETE": {
        const { id, userId } = req.body;
        if (!id || !userId) return res.status(400).json({ error: "Note ID and User ID are required" });

        const deletedNote = await Note.findOneAndDelete({ _id: id, userId });
        if (!deletedNote) return res.status(404).json({ error: "Note not found or unauthorized" });

        return res.status(200).json({ message: "Note deleted successfully" });
      }

      default:
        return res.status(405).json({ error: "Method not allowed" });
    }
  } catch (error) {
    console.error("API Error:", error);
    return res.status(500).json({ error: "Internal Server Error" });
  }
}

