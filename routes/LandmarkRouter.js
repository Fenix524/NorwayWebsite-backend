import express from 'express'
import {
	createLandmark,
	deleteLandmark,
	getAllLandmarks,
	getOneLandmark,
	updateLandmark,
} from '../controllers/LandmarkPageController.js'

const landmarksRouter = express.Router()

landmarksRouter.get('/', getAllLandmarks)
landmarksRouter.get('/:id', getOneLandmark)
landmarksRouter.delete('/:id', deleteLandmark)
landmarksRouter.post('/', createLandmark)
landmarksRouter.put('/:id', updateLandmark)

export default landmarksRouter
