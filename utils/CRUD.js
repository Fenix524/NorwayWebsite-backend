import HttpError from "./HttpError.js";
import { asyncWrapper } from "./asyncWrapper.js";

export const getOneDocument = (
  Model,
  searchField = "_id",
  populateFields = []
) => {
  return asyncWrapper(async (req, res, next) => {
    const param = Object.values(req.params)[0];

    console.log({ param });

    // Формуємо запит з популяцією полів
    let query = Model.findOne({ [searchField]: param });

    // Додаємо популяцію полів, якщо вони вказані
    populateFields.forEach((field) => {
      query = query.populate(field);
    });

    const doc = await query;

    if (!doc) {
      return next(HttpError(404));
    }

    res.status(200).json(doc);
  });
};

function paramNormalizer(param) {
  return JSON.stringify(param).replace(/[{}"]/g, "");
}

export const getAllDocuments = (Model, populateFields = []) => {
  return asyncWrapper(async (req, res, next) => {
    const { filter, sort, page = 1, limit = 20 } = req.query;

    try {
      let finalFilter = [];
      let finalSort = {};

      if (filter) {
        const normalizedFilter = paramNormalizer(filter);
        const filterPairs = normalizedFilter.split(",");

        filterPairs.forEach((pair) => {
          const [key, value] = pair.split(":");
          finalFilter.push({ [key]: { $regex: value, $options: "i" } });
        });
      }

      const mongoFilter = finalFilter.length > 0 ? { $or: finalFilter } : {};

      if (sort) {
        const sortArr = paramNormalizer(sort).split(":");
        finalSort = { [sortArr[0]]: parseInt(sortArr[1], 10) || 1 };
      }

      // Виконуємо запит до бази даних
      let query = Model.find(mongoFilter)
        .sort(finalSort)
        .skip((page - 1) * limit)
        .limit(limit);

      // Додаємо популяцію полів, якщо вони вказані
      populateFields.forEach((field) => {
        query = query.populate(field);
      });

      const documents = await query;

      const total = await Model.countDocuments(mongoFilter);

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
    const doc = await Model.create(req.body);

    res.status(200).json(doc);
  });
};

export const updateDocument = (Model, searchField = "_id") => {
  return asyncWrapper(async (req, res, next) => {
    const param = Object.values(req.params)[0];
    const updatedData = req.body; // Оновлені дані

    console.log("================== Update =====================");
    console.log({ param, updatedData });

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
