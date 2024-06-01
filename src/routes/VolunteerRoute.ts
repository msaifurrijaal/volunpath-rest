import { Router } from "express";
import UserController from "../controllers/UserController";
import Authorization from "../middlewares/Authorization";

const volunteerRoutes: Router = Router();

volunteerRoutes.get(
  "/volunteers",
  Authorization.authenticate,
  UserController.getAllVolunteers
);

export default volunteerRoutes;
