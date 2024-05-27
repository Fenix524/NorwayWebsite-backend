import express from "express";
import { protect } from "../middlewares/protect.js";
import { userRoles } from "../constants/userRoles.js";
import {
  addToBookmarks,
  getAllBookmarks,
  getOneBookmark,
  removeFromBookmarks,
} from "../controllers/BookmarkController.js";

const bookmarkRouter = express.Router();

bookmarkRouter.use(protect());
bookmarkRouter.get("/", getAllBookmarks);
bookmarkRouter.get("/:id", getOneBookmark);
bookmarkRouter.post("/", addToBookmarks);
bookmarkRouter.delete("/:id", removeFromBookmarks);

export default bookmarkRouter;
