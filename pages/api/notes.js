import connectToDB from "../../lib/connectToDB";
import Note from "../../models/Note";

export default async function handler(req, res) {
  try {
    await connectToDB();

    switch (req.method) {
      case "GET": {
        const notes = await Note.find().sort({ timestamp: -1 });
        return res.status(200).json(notes);
      }
      
      case "POST": {
        const { note, tag } = req.body;
        if (!note) return res.status(400).json({ error: "Note is required" });

        const newNote = await Note.create({ text: note, tag, timestamp: Date.now() });
        return res.status(201).json(newNote);
      }
      
      case "PUT": {
        const { id, newText } = req.body;
        if (!id || !newText) return res.status(400).json({ error: "Invalid input" });

        const updatedNote = await Note.findByIdAndUpdate(
          id,
          { text: newText, timestamp: Date.now() },
          { new: true, runValidators: true }
        );

        if (!updatedNote) return res.status(404).json({ error: "Note not found" });
        return res.status(200).json(updatedNote);
      }
      
      case "DELETE": {
        const { id } = req.body;
        if (!id) return res.status(400).json({ error: "Note ID is required" });

        const deletedNote = await Note.findByIdAndDelete(id);
        if (!deletedNote) return res.status(404).json({ error: "Note not found" });
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
