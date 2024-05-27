import { CityPage } from "../models/CityPage.js";
import {
  createDocument,
  deleteDocument,
  getAllDocuments,
  getOneDocument,
  updateDocument,
} from "../utils/CRUD.js";

export const getAllCities = getAllDocuments(CityPage);
export const getOneCity = getOneDocument(CityPage);
export const createCity = createDocument(CityPage);
export const deleteCity = deleteDocument(CityPage);
export const updateCity = updateDocument(CityPage);
