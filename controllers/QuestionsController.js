import { QuestionAnswer } from "../models/Questions.js";
import {
  deleteDocument,
  getAllDocuments,
  getOneDocument,
  updateDocument,
} from "../utils/CRUD.js";
import HttpError from "../utils/HttpError.js";
import { asyncWrapper } from "../utils/asyncWrapper.js";

export const askQuestion = asyncWrapper(async (req, res, next) => {
  const { question } = req.body;

  if (!question) {
    return res.status(400).json({ message: "Потрібно вказати питання." });
  }

  const newQuestion = await QuestionAnswer.create({
    question,
    askedBy: req.user._id,
  });

  if (!newQuestion) return next(HttpError(400, "Помилка створення питання"));

  // Fetch the newly created question with population
  const populatedQuestion = await QuestionAnswer.findById(newQuestion._id)
    .populate("askedBy")
    .populate("answers.answeredBy");

  res.status(201).json(populatedQuestion);
});

export const answerQuestion = asyncWrapper(async (req, res, next) => {
  const { answer } = req.body;
  const { questionId } = req.params;

  if (!answer || !questionId) {
    return res
      .status(400)
      .json({ message: "Потрібно вказати answer та questionId." });
  }

  const question = await QuestionAnswer.findById(questionId);
  if (!question) {
    return res.status(404).json({ message: "Питання не знайдено." });
  }

  question.answers.push({
    answer,
    answeredBy: req.user._id,
    answeredAt: Date.now(),
  });

  await question.save();

  const populatedQuestion = await QuestionAnswer.findById(questionId)
    .populate("askedBy")
    .populate("answers.answeredBy");

  res.status(200).json(populatedQuestion);
});

// ==============================================================================================

export const getOneQuestion = getOneDocument(QuestionAnswer, undefined, [
  "askedBy",
  "answers.answeredBy",
]);

export const updateQuestion = updateDocument(QuestionAnswer);

export const deleteQuestion = deleteDocument(QuestionAnswer);

export const getAllQuestions = getAllDocuments(QuestionAnswer, [
  "askedBy",
  "answers.answeredBy",
]);

export const likeQuestion = asyncWrapper(async (req, res, next) => {
  const { questionId } = req.params;
  const { _id: userId } = req.user;

  const currentQuestion = await QuestionAnswer.findById(questionId)
    .populate("askedBy")
    .populate("answers.answeredBy");

  if (!currentQuestion) return next(HttpError(404));
  if (currentQuestion.likes.includes(userId)) {
    currentQuestion.likes.pull(userId);
    await currentQuestion.save();
    return res.status(200).json(currentQuestion);
  }

  currentQuestion.likes.push(userId);
  await currentQuestion.save();

  res.status(200).json(currentQuestion);
});

// ==============================================================================================

export const updateAnswer = asyncWrapper(async (req, res, next) => {
  const { questionId, answerId } = req.params;

  const currentQuestion = await QuestionAnswer.findById(questionId);
  if (!currentQuestion) return next(HttpError(404));

  let currentAnswer = currentQuestion.answers.find(
    (answer) => answer.id === answerId
  );
  if (!currentAnswer) return next(HttpError(404));

  currentAnswer = { ...currentAnswer, ...req.body };
  await currentQuestion.save();

  res.status(200).json(currentQuestion);
});

export const deleteAnswer = asyncWrapper(async (req, res, next) => {
  const { questionId, answerId } = req.params;

  const currentQuestion = await QuestionAnswer.findById(questionId);
  if (!currentQuestion) return next(HttpError(404));

  const answerIndex = currentQuestion.answers.findIndex(
    (answer) => answer.id === answerId
  );
  if (answerIndex === -1) return next(HttpError(404));

  currentQuestion.answers.splice(answerIndex, 1);
  await currentQuestion.save();

  res.status(200).json(currentQuestion);
});

export const likeAnswer = asyncWrapper(async (req, res, next) => {
  const { questionId, answerId } = req.params;
  const { _id: userId } = req.user;

  console.log({ questionId, answerId });

  const currentQuestion = await QuestionAnswer.findById(questionId)
    .populate("askedBy")
    .populate("answers.answeredBy");

  if (!currentQuestion) {
    return next(HttpError(404, "Question not found"));
  }

  const currentAnswer = currentQuestion.answers.find(
    (answer) => answer.id === answerId
  );

  if (!currentAnswer) {
    return next(HttpError(404, "Answer not found"));
  }

  if (currentAnswer.likes.includes(userId)) {
    currentAnswer.likes.pull(userId);
  } else {
    currentAnswer.likes.push(userId);
  }

  await currentQuestion.save();

  res.status(200).json(currentQuestion);
});
