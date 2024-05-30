import express from "express";
import { protect } from "../middlewares/protect.js";
import { userRoles } from "../constants/userRoles.js";
import {
  addToBookmarks,
  getAllBookmarks,
  getUserBookmark,
  removeFromBookmarks,
  toggleBookmark,
} from "../controllers/BookmarkController.js";

const bookmarkRouter = express.Router();

bookmarkRouter.use(protect());
bookmarkRouter.get("/", getAllBookmarks);
bookmarkRouter.get("/me", getUserBookmark);
bookmarkRouter.post("/", addToBookmarks);
bookmarkRouter.put("/:id", toggleBookmark);
bookmarkRouter.delete("/:id", removeFromBookmarks);

export default bookmarkRouter;
