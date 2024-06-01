import { Router } from "express";
import UserController from "../controllers/UserController";
import UserValidation from "../middlewares/validations/UserValidation";
import Authorization from "../middlewares/Authorization";

const userRoutes: Router = Router();

userRoutes.post(
  "/auth/login",
  UserValidation.loginValidation,
  UserController.loginUser
);
userRoutes.post(
  "/auth/register",
  UserValidation.registerValidation,
  UserController.registerUser
);
userRoutes.get(
  "/users",
  Authorization.authenticate,
  UserController.getAllUsers
);
userRoutes.get(
  "/me",
  Authorization.authenticate,
  UserController.detailSelfUser
);
userRoutes.get(
  "/users/:id",
  Authorization.authenticate,
  UserController.detailUser
);
userRoutes.get(
  "/volunteers",
  Authorization.authenticate,
  UserController.getAllVolunteers
);
userRoutes.get(
  "/organizations",
  Authorization.authenticate,
  UserController.getAllOrganizations
);

export default userRoutes;
