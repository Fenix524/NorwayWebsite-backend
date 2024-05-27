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
import { protect } from "../middlewares/protect.js";
import { userRoles } from "../constants/userRoles.js";

const userRouter = express.Router();

userRouter.get("/", getAllUsers);
userRouter.get("/:id", getOneUser);

userRouter.use(protect([userRoles.ADMIN]));
userRouter.post("/", createUser);
userRouter.put("/:id", updateUser);
userRouter.delete("/:id", deleteUser);

export default userRouter;
