import { User } from "../models/User.js";
import { asyncWrapper } from "../utils/asyncWrapper.js";

import { checkToken, signToken } from "../services/jwtServices.js";
import { v4 as uuidv4 } from "uuid";
import HttpError from "../utils/HttpError.js";
import {
  passwordDecryption,
  passwordEncryption,
} from "../services/passwordHashService.js";
import {
  createDocument,
  deleteDocument,
  getAllDocuments,
  getOneDocument,
  updateDocument,
} from "../utils/CRUD.js";

export const login = asyncWrapper(async (req, res, next) => {
  const userData = req.body;
  const { email, password } = userData;

  const ourUser = await User.findOne({ email });
  if (!ourUser) return next(HttpError(404, "Invalid login or password"));

  const isValidPassword = passwordDecryption(password, ourUser.password);
  if (!isValidPassword)
    return next(HttpError(404, "Invalid login or password"));

  const jwtToken = signToken(ourUser._id);
  console.log(jwtToken);

  ourUser.token = jwtToken;
  ourUser.save();

  res.status(200).json({
    user: { ...ourUser._doc },
    token: jwtToken,
  });
});

export const signup = asyncWrapper(async (req, res, next) => {
  const userData = req.body;
  const { email, password } = userData;
  console.log(userData);

  const ourUser = await User.findOne({ email });
  if (ourUser) return next(HttpError(409, "Email in use"));

  const hashedPassword = passwordEncryption(password);
  const verificationToken = uuidv4();

  const newUser = await User.create({
    ...userData,
    password: hashedPassword,
    verificationToken,
  });

  const jwtToken = signToken(newUser._id);

  newUser.token = jwtToken;
  newUser.save();

  // sendVerifyMail(verificationToken)

  res.status(201).json({
    user: { password, ...newUser._doc },
    token: jwtToken,
  });
});
export const getMe = asyncWrapper(async (req, res, next) => {
  const token =
    req.headers.authorization?.startsWith("Bearer ") &&
    req.headers.authorization.split(" ")[1];

  const userId = checkToken(token);
  if (!userId) return next(HttpError(401));

  const currentUser = await User.findById(userId);

  if (!currentUser || currentUser.token !== token) return next(HttpError(401));

  res.status(200).json(currentUser);
});

export const getAllUsers = getAllDocuments(User);
export const getOneUser = getOneDocument(User);
export const deleteUser = createDocument(User);
export const createUser = deleteDocument(User);
export const updateUser = updateDocument(User);
