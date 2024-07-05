import { Router } from "express";
import UserController from "../controllers/UserController";
import UserValidation from "../middlewares/validations/UserValidation";
import Authorization from "../middlewares/Authorization";
import upload from "../middlewares/multer";

const userRoutes: Router = Router();

userRoutes.post(
  "/auth/login",
  UserValidation.loginValidation,
  UserController.loginUser
);
userRoutes.post(
  "/auth/register",
  upload.single("image"),
  UserValidation.registerValidation,
  UserController.registerUser
);
userRoutes.put(
  "/users/:id",
  Authorization.authenticate,
  upload.single("image"),
  UserValidation.updateUserValidation,
  UserController.updateUser
);
userRoutes.post(
  "/auth/logout",
  Authorization.authenticate,
  UserController.logoutUser
);
userRoutes.get(
  "/users",
  Authorization.authenticate,
  UserController.getAllActiveUsers
);
userRoutes.get(
  "/users/all",
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
userRoutes.put(
  "/users/:id/update-password",
  Authorization.authenticate,
  UserValidation.updatePasswordValidation,
  UserController.updatePassword
);
userRoutes.delete(
  "/users/:id",
  Authorization.authenticate,
  Authorization.authorizeUserDelete,
  UserController.deleteUser
);

userRoutes.delete(
  "/users/:id/soft-delete",
  Authorization.authenticate,
  Authorization.authorizeUserDelete,
  UserController.softDeleteUser
);

userRoutes.get(
  "/auth/refresh-token",
  UserController.refreshToken
)

export default userRoutes;
