import jwt from "jsonwebtoken";
import userSchema from "../Schema/user.schema.js";
export const verifyToken = async function (req, res, next) {
  const token = req.header("Authorization");
  if (!token) {
    res.send({ msg: "token not authorized" });
  } else {
    const user = jwt.verify(token, "secretkeyisgiven");
    const userData = await userSchema
      .findOne({ email: user.email })
      .select({ password: 0 });
    req.user = userData;
    req.token = token;
    next();
  }
};
