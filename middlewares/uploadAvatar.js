import multer from "multer";
import { v4 } from "uuid";
import path from "path";
import fs from "fs";
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

export const uploadFile = (folderName, fieldName) => {
  const storage = multer.diskStorage({
    destination: (req, file, cb) => {
      cb(null, path.join("public", "images", folderName));
    },
    filename: (req, file, cb) => {
      const extantion = file.mimetype.split("/")[1];
      cb(null, `${v4()}.${extantion}`);
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
  return multer({
    storage: storage,
    fileFilter: filter,
  }).single(fieldName);
};

export const deleteFile = (folderName) => {
  return (req, res, next) => {
    const { filePath } = req.body;
    console.log({ filePath });
    const fileName = path.basename(filePath);
    console.log({ fileName });
    const fullFilePath = path.join("public", "images", folderName, fileName);
    console.log({ fullFilePath });

    fs.unlink(fullFilePath, (err) => {
      if (err) {
        // If the error is because the file does not exist, it may not be an error
        if (err.code === "ENOENT") {
          return next(HttpError(404, "File not found"));
        }
        // Some other error occurred
        return next(
          HttpError(500, "An error occurred while deleting the file")
        );
      }
      // Successfully deleted the file
      next();
    });
  };
};
