import { Model } from "mongoose";
import { User } from "../models/User.js";
import { checkToken } from "../services/jwtServices.js";
import HttpError from "../utils/HttpError.js";
import { asyncWrapper } from "../utils/asyncWrapper.js";
import { userRoles } from "../constants/userRoles.js";

// Middleware function to protect routes based on user roles
export const protect = (userRoleArr) => {
  return asyncWrapper(async (req, res, next) => {
    console.log("Start protect");
    // Get the token from the Authorization header
    const token =
      req.headers.authorization?.startsWith("Bearer ") &&
      req.headers.authorization.split(" ")[1];

    // Verify the token and get the user ID
    const userId = checkToken(token);
    if (!userId) return next(HttpError(401));

    // Find the current user by ID
    const currentUser = await User.findById(userId);
    if (!currentUser || currentUser.token !== token)
      return next(HttpError(401));

    console.log(currentUser);
    // Check if the user's role is included in the allowed roles

    if (!userRoleArr) {
      req.user = currentUser;
      return next();
    }

    if (!userRoleArr.includes(currentUser.role)) {
      return next(
        HttpError(403, "Forbidden: You do not have the required roles")
      );
    }

    req.user = currentUser;
    console.log("End protect");
    next();
  });
};

export const creatorProtect = (model, authorField = "askedBy") => {
  return asyncWrapper(async (req, res, next) => {
    if (req.user.role === userRoles.ADMIN) {
      console.log("Но ладно Адмін, проходи");
      return next();
    }

    const param = Object.values(req.params)[0];

    const curentPost = await model.findById(param);

    if (!curentPost) return next(HttpError(404));

    if (curentPost[authorField].toString() !== req.user.id) {
      return next(
        HttpError(403, "Forbidden: You do not have the required roles")
      );
    }

    next();
  });
};
