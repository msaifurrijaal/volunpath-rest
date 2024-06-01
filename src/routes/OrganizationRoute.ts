import { Router } from "express";
import UserController from "../controllers/UserController";
import Authorization from "../middlewares/Authorization";

const organizationRoutes: Router = Router();

organizationRoutes.get(
  "/organizations",
  Authorization.authenticate,
  UserController.getAllOrganizations
);

export default organizationRoutes;
