import cookieSession from "cookie-session"; 

const MAX_INACTIVITY_TIME = 60 * 60 * 1000; 

const sessionMiddleware = cookieSession({
  name: "session",
  keys: [process.env.SESSION_SECRET],
  maxAge: 24 * 60 * 60 * 1000, 
  httpOnly: true,
  secure: true,
  sameSite: "lax",
});

export default function withSession(req, res, next) {
  sessionMiddleware(req, res, () => {
    if (!req.session) req.session = {};

    const now = Date.now();

    if (req.session.lastActivity) {
      console.log("⏳ Last Activity:", req.session.lastActivity);
      console.log("⌛ Time Difference:", now - req.session.lastActivity);
    }

    if (req.session.lastActivity && now - req.session.lastActivity > MAX_INACTIVITY_TIME) {
      console.log("❌ Session expired due to inactivity.");

      req.session = null;
      res.setHeader("Set-Cookie", `session=; Path=/; HttpOnly; Max-Age=0`);
    } else {
      req.session.lastActivity = now;
    }

    try {
      next();
    } catch (error) {
      console.error("⚠️ Session Middleware Error:", error);
      res.status(500).json({ error: "Internal Server Error" });
    }
  });
}
