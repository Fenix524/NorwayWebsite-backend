import express from "express";
import {
  createUser,
  deleteUser,
  getAllUsers,
  getMe,
  getOneUser,
  login,
  signup,
  updateUser,
} from "../controllers/UserController.js";
import { creatorProtect, protect } from "../middlewares/protect.js";
import { userRoles } from "../constants/userRoles.js";
import { User } from "../models/User.js";

const userRouter = express.Router();

userRouter.get("/", getAllUsers);
userRouter.get("/:id", getOneUser);

userRouter.post("/", protect([userRoles.ADMIN]), createUser);
userRouter.put(
  "/:id",
  protect([userRoles.ADMIN, userRoles.USER]),
  creatorProtect(User, "_id"),
  updateUser
);

userRouter.delete(
  "/:id",
  protect([userRoles.ADMIN, userRoles.USER]),
  creatorProtect(User, "_id"),
  deleteUser
);

export default userRouter;
