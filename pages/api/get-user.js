import withSession from "../../lib/session";

export default async function handler(req, res) {
  withSession(req, res, async () => {
    let user = req.cookies.session;

    if (!user) {
      return res.status(401).json({ error: "Not authenticated" });
    }

    try {
      const parsedUser = JSON.parse(user); 

      return res.status(200).json({
        userId: parsedUser.userId,
        fullName: parsedUser.fullName,
        isVerified: parsedUser.isVerified,
      });

    } catch (error) {
      console.error("Error parsing user data:", error);
      return res.status(500).json({ error: "Invalid session data" });
    }
  });
}
