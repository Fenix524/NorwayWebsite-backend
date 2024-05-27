import { CityPage } from "../models/CityPage";
import { LandmarkPage } from "../models/LandmarkPage.js";
import { UserSubmittedSection } from "../models/UserSubmittedSection.js";
import { asyncWrapper } from "../utils/asyncWrapper";

export const readOneSection = asyncWrapper(async (req, res, next) => {
  const { id } = req.params;
  const section = await UserSubmittedSection.findById(id);

  if (!section) {
    return res.status(404).json({ message: "Section not found" });
  }

  res.status(200).json(section);
});

export const readAllSection = asyncWrapper(async (req, res, next) => {
  const sections = await UserSubmittedSection.find();
  res.status(200).json(sections);
});

export const addSection = asyncWrapper(async (req, res, next) => {
  const { user, page, pageType, title, content, images } = req.body;

  const newSection = new UserSubmittedSection({
    user,
    page,
    pageType,
    title,
    content,
    images,
  });

  await newSection.save();
  res.status(201).json(newSection);
});

export const updateSection = asyncWrapper(async (req, res, next) => {
  const { id } = req.params;
  const updates = req.body;

  const updatedSection = await UserSubmittedSection.findByIdAndUpdate(
    id,
    updates,
    {
      new: true,
      runValidators: true,
    }
  );

  if (!updatedSection) {
    return res.status(404).json({ message: "Section not found" });
  }

  res.status(200).json(updatedSection);
});

export const deleteSection = asyncWrapper(async (req, res, next) => {
  const { id } = req.params;

  const deletedSection = await UserSubmittedSection.findByIdAndDelete(id);

  if (!deletedSection) {
    return res.status(404).json({ message: "Section not found" });
  }

  res.status(200).json({ message: "Section deleted" });
});

export const confirmationSection = asyncWrapper(async (req, res, next) => {
  const { id } = req.params;

  const confirmedSection = await UserSubmittedSection.findByIdAndUpdate(
    id,
    { approved: true },
    { new: true }
  );

  if (!confirmedSection) {
    return res.status(404).json({ message: "Section not found" });
  }

  const PageModel =
    confirmedSection.pageType === "Landmark" ? LandmarkPage : CityPage;

  const page = await PageModel.findById(confirmedSection.page);

  if (!page) {
    return res
      .status(404)
      .json({ message: `${confirmedSection.pageType} page not found` });
  }

  page.sections.push({
    title: confirmedSection.title,
    content: confirmedSection.content,
    images: confirmedSection.images,
  });

  await page.save();

  res.status(200).json(confirmedSection);
});

export const rejectionSection = asyncWrapper(async (req, res, next) => {
  const { id } = req.params;

  const rejectedSection = await UserSubmittedSection.findByIdAndUpdate(
    id,
    { approved: false },
    { new: true }
  );

  if (!rejectedSection) {
    return res.status(404).json({ message: "Section not found" });
  }

  res.status(200).json(rejectedSection);
});
