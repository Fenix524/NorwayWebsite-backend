import express from "express";
import { protect } from "../middlewares/protect.js";
import { userRoles } from "../constants/userRoles.js";
import { uploadFile } from "../controllers/fileController.js";
import { upload } from "../middlewares/file.js";

const uploadRouter = express.Router();

uploadRouter.post("/upload", upload.single("picture"), uploadFile);

export default uploadRouter;
