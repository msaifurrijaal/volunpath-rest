import { Router } from "express";
import CategoryEventController from "../controllers/CategoryEventController";
import Authorization from "../middlewares/Authorization";

const categoryEventRoutes: Router = Router();

categoryEventRoutes.get(
  "/category-events",
  Authorization.authenticate,
  CategoryEventController.getAllCategoryEvents
);

export default categoryEventRoutes;
