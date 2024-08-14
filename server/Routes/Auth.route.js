import express from "express";
import {
  signInUser,
  signUpUser,
  userdata,
} from "../controller/Auth.controller.js";
import { logOut, user, validateUser } from "../validator/user.validate.js";
import { verifyToken } from "../middlewares/verifyToken.mdw.js";
import { verifyAdmin } from "../middlewares/VerifyAdmin.js";
const authRouter = express.Router();
authRouter.post("/register", validateUser(user), signUpUser);
authRouter.post("/login", signInUser);
authRouter.post("/logout", logOut);
authRouter.post("/user/data", verifyToken, userdata);
export default authRouter;
