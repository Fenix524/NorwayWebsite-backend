import express from "express";
import {
  createLandmark,
  deleteLandmark,
  getAllLandmarks,
  getOneLandmark,
  updateLandmark,
} from "../controllers/LandmarkPageController.js";
import { protect } from "../middlewares/protect.js";
import { userRoles } from "../constants/userRoles.js";

const landmarksRouter = express.Router();

landmarksRouter.get("/", getAllLandmarks);
landmarksRouter.get("/:id", getOneLandmark);

landmarksRouter
  .use(protect([userRoles.ADMIN]))
  .delete("/:id", deleteLandmark)
  .post("/", createLandmark)
  .put("/:id", updateLandmark);

export default landmarksRouter;
