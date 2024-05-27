import { LandmarkPage } from "../models/LandmarkPage.js";
import {
  createDocument,
  deleteDocument,
  getAllDocuments,
  getOneDocument,
  updateDocument,
} from "../utils/CRUD.js";

export const getAllLandmarks = getAllDocuments(LandmarkPage);
export const getOneLandmark = getOneDocument(LandmarkPage);
export const deleteLandmark = createDocument(LandmarkPage);
export const createLandmark = deleteDocument(LandmarkPage);
export const updateLandmark = updateDocument(LandmarkPage);
