import cookieSession from "cookie-session";

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
    try {
      next();
    } catch (error) {
      console.error("Session Middleware Error:", error);
      res.status(500).json({ error: "Internal Server Error" });
    }
  });
}
