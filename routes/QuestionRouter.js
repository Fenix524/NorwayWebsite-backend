import express from "express";

import { creatorProtect, protect } from "../middlewares/protect.js";
import {
  answerQuestion,
  askQuestion,
  deleteAnswer,
  deleteQuestion,
  diselikeAnswer,
  diselikeQuestion,
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

questionRouter.get("/answer", getAllQuestions);
questionRouter.get("/answer/:questionId", getOneQuestion);
//<<<=====================================================================================================>>>//

questionRouter.use(protect());
questionRouter.post("/ask", askQuestion);
questionRouter.post("/ask/like/:questionId", likeQues tion);
questionRouter.post("/ask/diselike/:questionId", diselikeQuestion);

questionRouter.post("/answer/:questionId/:answerId", answerQuestion);
questionRouter.post("/answer/like/:questionId/:answerId", likeAnswer);
questionRouter.post("/answer/diselike/:questionId/:answerId", diselikeAnswer);

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
