import express from "express";
import { protect } from "../middlewares/protect.js";
import { userRoles } from "../constants/userRoles.js";
import { upload } from "../middlewares/file.js";
import { deleteFile, uploadFile } from "../middlewares/uploadAvatar.js";

const uploadRouter = express.Router();

uploadRouter.post(
  "/pageImages",
  uploadFile("pageImages", "img"),
  (req, res) => {
    res.json({ url: req.file.path.replace("public", "") });
  }
);

uploadRouter.delete("/pageImages", deleteFile("pageImages"), (req, res) => {
  res.json({ msg: "OK" });
});

export default uploadRouter;
