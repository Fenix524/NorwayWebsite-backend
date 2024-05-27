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

  // Перевірка валідності даних
  if (!question) {
    return res.status(400).json({ message: "Потрібно вказати питання." });
  }

  // Створення нового питання
  const newQuestion = await QuestionAnswer.create({
    question,
    askedBy: req.user._id,
  });

  if (!newQuestion) return next(HttpError(400, "Помилка створення питання"));

  res.status(201).json(newQuestion);
});

export const answerQuestion = asyncWrapper(async (req, res, next) => {
  const { answer } = req.body;
  const { questionId } = req.params;

  // Перевірка валідності даних
  if (!answer || !questionId) {
    return res
      .status(400)
      .json({ message: "Потрібно вказати answer та questionId." });
  }

  // Пошук питання

  const question = await QuestionAnswer.findById(questionId);
  if (!question) {
    return res.status(404).json({ message: "Питання не знайдено." });
  }

  // Додати нову відповідь
  question.answers.push({
    answer,
    answeredBy: req.user._id,
    answeredAt: Date.now(),
  });

  // Оновлення питання в базі даних
  await question.save();
  res.status(200).json(question);
});

// ==============================================================================================

export const getOneQuestion = getOneDocument(QuestionAnswer);

export const updateQuestion = updateDocument(QuestionAnswer);

export const deleteQuestion = deleteDocument(QuestionAnswer);

export const getAllQuestions = asyncWrapper(async (req, res, next) => {
  const { page = 1, limit = 20, search } = req.query;

  try {
    let query = QuestionAnswer.find();

    if (search) {
      query = query.where("question").regex(new RegExp(search, "i"));
    }

    const questions = await query
      .limit(limit * 1)
      .skip((page - 1) * limit)
      .exec();

    const count = await QuestionAnswer.countDocuments();

    res.json({
      questions,
      totalPages: Math.ceil(count / limit),
      currentPage: page,
    });
  } catch (error) {
    console.error("Error while fetching questions:", error);
    res.status(500).json({ error: "Internal server error" });
  }
});

export const likeQuestion = asyncWrapper(async (req, res, next) => {
  const { questionId } = req.params;
  const { _id: userId } = req.user;

  const currentQuestion = await QuestionAnswer.findById(questionId);

  if (!currentQuestion) return next(HttpError(404));
  if (currentQuestion.likes.includes(userId)) return next(HttpError(409));

  currentQuestion.likes.push(userId);
  await currentQuestion.save();

  res.status(200).json(currentQuestion);
});

export const diselikeQuestion = asyncWrapper(async (req, res, next) => {
  const { questionId } = req.params;
  const { _id: userId } = req.user;

  const currentQuestion = await QuestionAnswer.findById(questionId);
  if (!currentQuestion) {
    return next(HttpError(404));
  }

  currentQuestion.likes.pull(userId);
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

  const currentQuestion = await QuestionAnswer.findById(questionId);

  if (!currentQuestion) return next(HttpError(404));

  const currentAnswer = currentQuestion.answers.find(
    (answer) => answer.id === answerId
  );
  if (!currentAnswer) return next(HttpError(404));

  if (currentAnswer.likes.includes(userId)) return next(HttpError(409));

  currentAnswer.likes.push(userId);
  await currentQuestion.save();

  res.status(200).json(currentQuestion);
});

export const diselikeAnswer = asyncWrapper(async (req, res, next) => {
  const { questionId, answerId } = req.params;
  const { _id: userId } = req.user;

  const currentQuestion = await QuestionAnswer.findById(questionId);

  if (!currentQuestion) return next(HttpError(404));

  const currentAnswer = currentQuestion.answers.find(
    (answer) => answer.id === answerId
  );

  currentAnswer.likes.pull(userId);
  await currentQuestion.save();

  res.status(200).json(currentQuestion);
});
