import { Router } from "express";
import UserController from "../controllers/UserController";
import VolunteerController from "../controllers/VolunteerController";
import Authorization from "../middlewares/Authorization";

const volunteerRoutes: Router = Router();

volunteerRoutes.get(
  "/volunteers",
  Authorization.authenticate,
  UserController.getAllVolunteers
);

volunteerRoutes.get(
  "/volunteers/activities/:id",
  Authorization.authenticate,
  VolunteerController.getVolunteerActivities
);

export default volunteerRoutes;
