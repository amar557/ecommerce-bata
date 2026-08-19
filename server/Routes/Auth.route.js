import express from "express";
import {
  signInUser,
  signUpUser,
  userdata,
  getAllUsers,
  updateProfile,
} from "../controller/Auth.controller.js";
import { logOut, user, validateUser } from "../validator/user.validate.js";
import { verifyToken } from "../middlewares/verifyToken.mdw.js";
import { verifyAdmin } from "../middlewares/VerifyAdmin.js";

const authRouter = express.Router();
authRouter.post("/register", validateUser(user), signUpUser);
authRouter.post("/login", signInUser);
authRouter.post("/logout", logOut);
authRouter.get("/user/data", verifyToken, userdata);
authRouter.get("/users", verifyToken, verifyAdmin, getAllUsers);
authRouter.put("/profile", verifyToken, updateProfile);

export default authRouter;
