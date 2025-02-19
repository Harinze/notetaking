import sessionMiddleware from "../../lib/session";

export default async function handler(req, res) {
  sessionMiddleware(req, res, async () => {
    if (!req.session.user) {
      return res.status(401).json({ error: "Not authenticated" });
    }

    return res.status(200).json({ user: req.session.user });
  });
}
