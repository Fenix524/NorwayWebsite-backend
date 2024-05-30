import multer from "multer";
import { v4 } from "uuid";
import path from "path";
import HttpError from "../utils/HttpError.js";

const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, path.join("public", "images", "userAvatars"));
  },
  filename: (req, file, cb) => {
    const extantion = file.mimetype.split("/")[1];
    cb(null, `${req.user.id}-${v4()}.${extantion}`);
  },
});

const filter = (req, file, cb) => {
  if (file.mimetype.split("/")[0] === "image") {
    cb(null, true);
  } else {
    cb(new HttpError(400, "Please upload images only"), false);
  }
};

const MB_SIZE = 1024 * 1024;
export const uploadAvatar = multer({
  storage: storage,
  fileFilter: filter,
}).single("avatar");

// export const uploadAvatar = (req, res, next) => {
//   next();
// };
