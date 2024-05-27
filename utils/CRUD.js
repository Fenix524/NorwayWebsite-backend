import HttpError from "./HttpError.js";
import { asyncWrapper } from "./asyncWrapper.js";

export const getOneDocument = (Model, searchField = "_id") => {
  return asyncWrapper(async (req, res, next) => {
    const param = Object.values(req.params)[0];
    const doc = await Model.findOne({ [searchField]: param }); // Замінюємо findById на findOne

    if (!doc) {
      return next(HttpError(404));
    }

    res.status(200).json(doc);
  });
};

export const getAllDocuments = (Model) => {
  return asyncWrapper(async (req, res, next) => {
    const { filter = {}, sort = {}, page = 1, limit = 10 } = req.query;

    try {
      const documents = await Model.find(filter)
        .sort(sort)
        .skip((page - 1) * limit)
        .limit(limit);

      const total = await Model.countDocuments(filter);

      res.json({
        data: documents,
        meta: {
          total,
          page,
          limit,
        },
      });
    } catch (error) {
      next(error);
    }
  });
};

export const createDocument = (Model, searchField = "_id") => {
  return asyncWrapper(async (req, res, next) => {
    const param = Object.values(req.params)[0];
    const doc = await Model.findOne({ [searchField]: param }); // Замінюємо findById на findOne

    if (!doc) {
      return next(HttpError(404));
    }

    res.status(200).json(doc);
  });
};

export const updateDocument = (Model, searchField = "_id") => {
  return asyncWrapper(async (req, res, next) => {
    const param = Object.values(req.params)[0];
    const updatedData = req.body; // Оновлені дані

    try {
      const doc = await Model.findOneAndUpdate(
        { [searchField]: param },
        updatedData,
        { new: true } // Повернути оновлений документ
      );

      if (!doc) {
        return next(HttpError(404));
      }

      res.status(200).json(doc);
    } catch (error) {
      next(error);
    }
  });
};

export const deleteDocument = (Model, searchField = "_id") => {
  return asyncWrapper(async (req, res, next) => {
    const param = Object.values(req.params)[0];

    try {
      const doc = await Model.findOneAndDelete({ [searchField]: param });

      if (!doc) {
        return next(HttpError(404));
      }

      res.status(200).json(doc);
    } catch (error) {
      next(error);
    }
  });
};
