import { Bookmark } from "../models/Bookmark.js";
import { CityPage } from "../models/CityPage.js";
import { LandmarkPage } from "../models/LandmarkPage.js";
import { pageType } from "../models/MoreInfoTempleate.js";
import HttpError from "../utils/HttpError.js";
import { asyncWrapper } from "../utils/asyncWrapper.js";
import { getOneCity } from "./CityPageController.js";
import { getOneLandmark } from "./LandmarkPageController.js";

export const getAllBookmarks = asyncWrapper(async (req, res, next) => {
  const userId = req.user._id;

  const bookmark = await Bookmark.findOne({ user: userId });
  if (!bookmark) return next(HttpError(404));

  const allBookmarks = await Promise.all(bookmark.pages.map(getPageDetails));

  res.status(200).json({
    allBookmarks: allBookmarks,
    citiesBookmarks: allBookmarks.filter(
      (bookmark) => bookmark.pageType === pageType.CITY
    ),
    landmarksBookmarks: allBookmarks.filter(
      (bookmark) => bookmark.pageType === pageType.LANDMARK
    ),
  });
});

export const getOneBookmark = asyncWrapper(async (req, res, next) => {
  const userId = req.user._id;
  const { id: pageId } = req.params;

  const bookmark = Bookmark.findOne({ user: userId });

  const city = await getOneCity(pageId);
  const landmark = await getOneLandmark(pageId);

  res.status(200).json(city || landmark);
});

export const addToBookmarks = asyncWrapper(async (req, res, next) => {
  const { pageId } = req.body;
  const userId = req.user._id;

  console.log(pageId);

  const bookmark = await Bookmark.findOne({ user: userId });
  console.log(bookmark);

  if (!bookmark) {
    return res.status(200).json(
      await Bookmark.create({
        user: userId,
        pages: [pageId],
      })
    );
  }

  if (bookmark.pages.includes(pageId)) {
    return next(HttpError(409, "This bookmark already exists"));
  }

  bookmark.pages.push(pageId);
  bookmark.save();

  res.status(200).json(bookmark);
});

export const removeFromBookmarks = asyncWrapper(async (req, res, next) => {
  const { id: pageId } = req.params;
  const userId = req.user._id;

  const bookmark = await Bookmark.findOneAndUpdate(
    { user: userId },
    { $pull: { pages: pageId } },
    { new: true }
  );

  if (!bookmark) {
    return next(HttpError(404));
  }

  res.status(200).json(bookmark);
});

const getPageDetails = async (pageId) => {
  const [city, landmark] = await Promise.all([
    CityPage.findById(pageId),
    LandmarkPage.findById(pageId),
  ]);
  return city || landmark;
};
