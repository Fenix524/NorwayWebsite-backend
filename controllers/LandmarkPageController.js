import { LandmarkPage } from '../models/LandmarkPage.js'
import { createCRUDHandler, CRUDOpertion } from '../utils/CRUD.js'

export const getAllLandmarks = createCRUDHandler(
	LandmarkPage,
	CRUDOpertion.GET_ALL
)
export const getOneLandmark = createCRUDHandler(
	LandmarkPage,
	CRUDOpertion.GET_BY_ID
)
export const deleteLandmark = createCRUDHandler(
	LandmarkPage,
	CRUDOpertion.DELETE
)
export const createLandmark = createCRUDHandler(
	LandmarkPage,
	CRUDOpertion.CREATE
)
export const updateLandmark = createCRUDHandler(
	LandmarkPage,
	CRUDOpertion.UPDATE
)
