import express from "express";
import {
  createCity,
  deleteCity,
  getAllCities,
  getOneCity,
  updateCity,
} from "../controllers/CityPageController.js";
import { protect } from "../middlewares/protect.js";
import { userRoles } from "../constants/userRoles.js";

const citiesRouter = express.Router();

citiesRouter.get("/", getAllCities);
citiesRouter.get("/:id", getOneCity);

citiesRouter
  .use(protect([userRoles.ADMIN]))
  .delete("/:id", deleteCity)
  .post("/", createCity)
  .put("/:id", updateCity);

export default citiesRouter;
