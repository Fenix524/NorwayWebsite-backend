import path from "path";
import { promises as fs } from "fs";

const uploadDir = path.join(process.cwd(), "uploads");
const storeImage = path.join(process.cwd(), "images");
import multer from "multer";

const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, uploadDir);
  },
  filename: (req, file, cb) => {
    cb(null, file.originalname);
  },
  limits: {
    fileSize: 1048576,
  },
});

export const upload = multer({
  storage: storage,
});
