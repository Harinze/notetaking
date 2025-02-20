import withSession from "../../lib/session";

export default async function handler(req, res) {
  withSession(req, res, async () => {
    let user = req.session.user;

    //Fallback to cookies if session is missing
    if (!user) {
      try {
        const cookieHeader = req.headers.cookie || "";
        const cookies = Object.fromEntries(
          cookieHeader.split("; ").map((c) => c.split("="))
        );

        if (cookies.session) {
          user = JSON.parse(decodeURIComponent(cookies.session));
        }
      } catch (error) {
        console.error("Failed to parse user from cookies:", error);
      }
    }

    if (!user) {
      return res.status(401).json({ error: "Not authenticated" });
    }

    return res.status(200).json({ user });
  });
}
