import cookieSession from "cookie-session";

const sessionConfig = cookieSession({
  name: "session",
  keys: [process.env.SESSION_SECRET],
  maxAge: 24 * 60 * 60 * 1000,
  httpOnly: true,
  secure: process.env.NODE_ENV === "production",
});

export default function sessionMiddleware(req, res, next) {
  sessionConfig(req, res, () => {
    next();
  });
}
