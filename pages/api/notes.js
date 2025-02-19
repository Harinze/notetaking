import connectToDB from "../../lib/connectToDB";
import Note from "../../models/Note";

export default async function handler(req, res) {
  await connectToDB();

  if (req.method === "GET") {
    const notes = await Note.find().sort({ timestamp: -1 });
    return res.status(200).json(notes);
  }

  if (req.method === "POST") {
    const { note, tag } = req.body;
    if (!note) return res.status(400).json({ error: "Note is required" });

    const newNote = await Note.create({ text: note, tag });
    return res.status(201).json(newNote);
  }

  if (req.method === "PUT") {
    const { id, newText } = req.body;
    if (!id || !newText) return res.status(400).json({ error: "Invalid input" });

    const updatedNote = await Note.findByIdAndUpdate(id, { text: newText, timestamp: Date.now() }, { new: true });
    return res.status(200).json(updatedNote);
  }

  if (req.method === "DELETE") {
    const { id } = req.body;
    if (!id) return res.status(400).json({ error: "Note ID is required" });

    await Note.findByIdAndDelete(id);
    return res.status(200).json({ message: "Note deleted" });
  }

  return res.status(405).json({ error: "Method not allowed" });
}
