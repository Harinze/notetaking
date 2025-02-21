import Session from "../../models/Session";
import cookie from "cookie";
import connectToDB from "../../lib/connectToDB";

export default async function handler(req, res) {
  if (req.method !== "POST") {
    return res.status(405).json({ error: "Method Not Allowed" });
  }

 await connectToDB()

  try {
    const cookies = cookie.parse(req.headers.cookie || "");
    const sessionToken = cookies.sessionToken;

    if (sessionToken) {
      await Session.deleteOne({ sessionToken });
    }


    res.setHeader(
      "Set-Cookie",
      cookie.serialize("sessionToken", "", {
        httpOnly: true,
        secure: true,
        sameSite: "lax",
        path: "/",
        maxAge: 0, 
      })
    );

    return res.status(200).json({ success: true, message: "Logged out successfully." });
  } catch (error) {
    console.error("Logout Error:", error);
    return res.status(500).json({ error: "Server error" });
  }
}


