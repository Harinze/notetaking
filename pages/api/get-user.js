import { withAuth } from "../../middleware/auth";

export default async function handler(req, res) {
  try {
    const authReq = await withAuth(req, res);

    if (!authReq || !authReq.user) {
      return; 
    }

    return res.status(200).json({
      success: true,
      user: {
        fullName: authReq.user.fullName,
        userId: authReq.user.userId,
        email: authReq.user.email,
        isLoggedIn: authReq.user.isLoggedIn,
        isVerified: authReq.user.isVerified,
        
      },
    });
  } catch (error) {
    console.error("❌ API Error:", error);
    return res.status(500).json({
      success: false,
      message: "An unexpected error occurred. Please try again later.",
    });
  }
}
