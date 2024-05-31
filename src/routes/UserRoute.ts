import { Router } from "express";
import UserController from "../controllers/UserController";
import UserValidation from "../middlewares/validations/UserValidation";

const userRoutes: Router = Router();

userRoutes.get("/login", UserController.loginUser);
userRoutes.get("/users", UserController.getAllUsers);
userRoutes.post(
  "/auth/register",
  UserValidation.registerValidation,
  UserController.registerUser
);

export default userRoutes;
