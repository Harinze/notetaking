import { withAuth } from "../../middleware/auth";

export default async function handler(req, res) {
  try {
    return withAuth(req, res, () => {
      if (!req.user) {
        return res.status(401).json({
          success: false,
          message: "Unauthorized: No user session found.",
        });
      }
      
      const { fullName, userId } = req.user;

      return res.status(200).json({
        success: true,
        user: { fullName, userId },
      });
    });
  } catch (error) {
    console.error("API Error:", error);

    return res.status(500).json({
      success: false,
      message: "An unexpected error occurred. Please try again later.",
    });
  }
}
