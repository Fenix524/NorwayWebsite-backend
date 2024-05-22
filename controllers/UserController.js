import { User } from "../models/User.js";
import { createCRUDHandler, CRUDOpertion } from "../utils/CRUD.js";
import { asyncWrapper } from "../utils/asyncWrapper.js";

import { signToken } from "../services/jwtServices.js";
import { v4 as uuidv4 } from "uuid";
import HttpError from "../utils/HttpError.js";
import {
  passwordDecryption,
  passwordEncryption,
} from "../services/passwordHashService.js";

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

  res.status(200).json({
    user: { password, ...ourUser._doc },
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

  // sendVerifyMail(verificationToken)

  res.status(201).json({
    user: { password, ...newUser._doc },
    token: jwtToken,
  });
});
export const getMe = asyncWrapper(async (req, res, next) => {});

export const getAllUsers = createCRUDHandler(User, CRUDOpertion.GET_ALL);
export const getOneUser = createCRUDHandler(User, CRUDOpertion.GET_BY_ID);
export const deleteUser = createCRUDHandler(User, CRUDOpertion.DELETE);
export const createUser = createCRUDHandler(User, CRUDOpertion.CREATE);
export const updateUser = createCRUDHandler(User, CRUDOpertion.UPDATE);
