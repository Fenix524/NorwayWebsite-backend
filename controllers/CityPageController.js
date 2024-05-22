import { CityPage } from '../models/CityPage.js'
import { CRUDOpertion, createCRUDHandler } from '../utils/CRUD.js'

export const getAllCities = createCRUDHandler(CityPage, CRUDOpertion.GET_ALL)
export const getOneCity = createCRUDHandler(CityPage, CRUDOpertion.GET_BY_ID)
export const deleteCity = createCRUDHandler(CityPage, CRUDOpertion.DELETE)
export const createCity = createCRUDHandler(CityPage, CRUDOpertion.CREATE)
export const updateCity = createCRUDHandler(CityPage, CRUDOpertion.UPDATE)
