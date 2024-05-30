import express from "express";

import { creatorProtect, protect } from "../middlewares/protect.js";
import {
  answerQuestion,
  askQuestion,
  deleteAnswer,
  deleteQuestion,
  getAllQuestions,
  getOneQuestion,
  likeAnswer,
  likeQuestion,
  updateAnswer,
  updateQuestion,
} from "../controllers/questionsController.js";
import { userRoles } from "../constants/userRoles.js";
import { QuestionAnswer } from "../models/Questions.js";

const questionRouter = express.Router();

questionRouter.get("/", getAllQuestions);
questionRouter.get("/:questionId", getOneQuestion);
//<<<=====================================================================================================>>>//

questionRouter.use(protect());
questionRouter.post("/", askQuestion);
questionRouter.post("/like/:questionId", likeQuestion);

questionRouter.post("/answers/:questionId", answerQuestion);
questionRouter.post("/answers/like/:questionId/:answerId", likeAnswer);

//<<<=====================================================================================================>>>//
questionRouter.use(
  protect([userRoles.ADMIN, userRoles.MODERATOR, userRoles.USER])
);
// questionRouter.use("/answer/:questionId");
questionRouter.put(
  "/answer/:questionId",
  creatorProtect(QuestionAnswer),
  updateQuestion
);
questionRouter.delete(
  "/answer/:questionId",
  creatorProtect(QuestionAnswer),
  deleteQuestion
);
questionRouter.put(
  "/ask/:questionId/:answerId",
  creatorProtect(QuestionAnswer),
  updateAnswer
);
questionRouter.delete(
  "/ask/:questionId/:answerId",
  creatorProtect(QuestionAnswer),
  deleteAnswer
);

export default questionRouter;
