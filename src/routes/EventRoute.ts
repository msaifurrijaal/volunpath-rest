import { Router } from "express";
import EventController from "../controllers/EventController";
import Authorization from "../middlewares/Authorization";

const eventRoutes: Router = Router();

eventRoutes.get(
  "/events",
  Authorization.authenticate,
  EventController.getAllEvents
);

export default eventRoutes;
