import jwt from "jsonwebtoken";
import userSchema from "../Schema/user.schema.js";

export const verifyToken = async function (req, res, next) {
  try {
    const token = req.header("Authorization");

    if (!token) {
      return res.status(401).json({ msg: "Authorization token missing" });
    }
    // Verify token
    const decoded = jwt.verify(token, "secretkeyisgiven");

    // Find user (excluding password)
    const userData = await userSchema
      .findOne({ email: decoded.email })
      .select({ password: 0 });

    if (!userData) {
      return res.status(404).json({ msg: "User not found" });
    }

    req.user = userData;
    req.token = token;
    next();
  } catch (error) {
    console.error("Token verification error:", error.message);

    if (error.name === "JsonWebTokenError") {
      return res.status(401).json({ msg: "Invalid token" });
    } else if (error.name === "TokenExpiredError") {
      return res.status(401).json({ msg: "Token has expired" });
    }

    res.status(500).json({ msg: "Server error during token verification" });
  }
};
