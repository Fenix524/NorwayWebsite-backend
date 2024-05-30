import express from "express";
import { protect } from "../middlewares/protect.js";
import {
  getMe,
  login,
  logout,
  signup,
  updateMe,
} from "../controllers/UserController.js";
import { uploadAvatar } from "../middlewares/uploadAvatar.js";

const authRouter = express.Router();
console.log("routs");
authRouter.post("/login", login);
authRouter.post("/signup", signup);

authRouter.use(protect());
authRouter.get("/me", getMe);
authRouter.patch("/me", uploadAvatar, updateMe);
authRouter.post("/logout", logout);

export default authRouter;
