import sessionMiddleware from "../../lib/session";

export default async function handler(req, res) {
  await sessionMiddleware(req, res, async () => {
    console.log('req.session', req.session)
    req.session = null; 
    res.setHeader("Set-Cookie", "session=; Path=/; HttpOnly; Max-Age=0"); 
    return res.status(200).json({ success: true, message: "Logged out successfully" });
  });
}
