import express from 'express'
import {
	createCity,
	deleteCity,
	getAllCities,
	getOneCity,
	updateCity,
} from '../controllers/CityPageController.js'

const citiesRouter = express.Router()

citiesRouter.get('/', getAllCities)
citiesRouter.get('/:id', getOneCity)
citiesRouter.delete('/:id', deleteCity)
citiesRouter.post('/', createCity)
citiesRouter.put('/:id', updateCity)

export default citiesRouter
