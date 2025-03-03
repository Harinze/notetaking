import cookie from "cookie";
import redis from '../../utils/redis'


export default async function handler(req, res) {

  const cookies = cookie.parse(req.headers.cookie || "");
  const sessionToken = cookies.sessionToken;

  if (!sessionToken) return clearSessionCookie(res);

  try {
    const sessionData = await redis.get(`session:${sessionToken}`);

    if (sessionData && sessionData.userId?._id) {
      await redis.del(`session:${sessionToken}`);
    }
  } catch (error) {
    console.error("Error during logout:", error);
    return res.status(500).json({ message: "Internal Server Error" });
  }

  return clearSessionCookie(res);
}

function clearSessionCookie(res) {
  res.setHeader(
    "Set-Cookie",
    cookie.serialize("sessionToken", "", {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "lax",
      path: "/",
      maxAge: 0,
    })
  );

  return res.status(200).json({ message: "Logged out successfully" });
}




