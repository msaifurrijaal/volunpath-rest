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
userRoutes.post(
  "/auth/logout",
  Authorization.authenticate,
  UserController.logoutUser
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

export default userRoutes;
