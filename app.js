import createError from "http-errors";
import express from "express";
import { fileURLToPath } from "url";
import path, { dirname, join } from "path";
import cookieParser from "cookie-parser";
import logger from "morgan";
import dotenv from "dotenv";

import indexRouter from "./routes/index.js";
import citiesRouter from "./routes/CityRouter.js";
import landmarksRouter from "./routes/LandmarkRouter.js";
import userRouter from "./routes/UserRouter.js";
import authRouter from "./routes/authRouter.js";
import bookmarkRouter from "./routes/BookmarkRouter.js";
import questionRouter from "./routes/QuestionRouter.js";
import { promises as fs } from "fs";
import cors from "cors";
import multer from "multer";
import uploadRouter from "./routes/uploadRouter.js";

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

console.log({ __filename, __dirname });

dotenv.config();
const app = express();

const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, path.join(__dirname, "public"));
  },
  filename: (req, file, cb) => {
    cb(null, file.originalname);
  },
  limits: {
    fileSize: 1048576,
  },
});

const upload = multer({
  storage: storage,
});

// view engine setup
app.set("views", join(__dirname, "views"));
app.set("view engine", "ejs");

app.use(logger("dev"));
app.use(express.json());
app.use(cors());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(join(__dirname, "public")));

// New route to serve images
app.get("/images/:filename", (req, res, next) => {
  const { filename } = req.params;
  const filePath = path.join(__dirname, "public", filename);

  fs.access(filePath)
    .then(() => {
      res.sendFile(filePath);
    })
    .catch((err) => {
      next(createError(404, "Image not found"));
    });
});

app.use("/", indexRouter);
app.use("/auth", authRouter);

app.use("/users", userRouter);
app.use("/upload", uploadRouter);
app.use("/cities", citiesRouter);
app.use("/landmarks", landmarksRouter);
app.use("/questions", questionRouter);
app.use("/bookmarks", bookmarkRouter);
app.use("/submitedSection", landmarksRouter);

// catch 404 and forward to error handler
app.use(function (req, res, next) {
  next(createError(404, "Route not found"));
});
app.use((err, req, res, next) => {
  const { status = 500, message = "Server error" } = err;
  res.status(status).json({ message });
});
// error handler
app.use(function (err, req, res, next) {
  // set locals, only providing error in development
  res.locals.message = err.message;
  res.locals.error = req.app.get("env") === "development" ? err : {};

  // render the error page
  res.status(err.status || 500);
  res.render("error");
});

export default app;
