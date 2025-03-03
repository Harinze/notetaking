import connectToDB from "../../lib/connectToDB";
import Note from "../../models/Note";
import { withAuth } from "../../middleware/auth";

export default async function handler(req, res) {
  await connectToDB(); 

  const authResponse = await withAuth(req, res);
  if (!authResponse.user) return;
  const { user } = authResponse;

  if (req.method !== "DELETE") {
    return res.status(405).json({ message: "Method Not Allowed" });
  }

  try {
    await Note.deleteMany({ userId: user.userId });
    return res.status(200).json({ message: "Your notes have been deleted successfully!" });
  } catch (error) {
    console.error("Delete All Notes Error:", error);
    return res.status(500).json({ message: "Error deleting notes" });
  }
}
