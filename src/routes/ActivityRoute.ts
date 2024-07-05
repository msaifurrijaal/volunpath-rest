import { Router } from "express";
import ActivityController from "../controllers/ActivityController";
import Authorization from "../middlewares/Authorization";
import ActivityValidation from "../middlewares/validations/ActivityValidation";

const activityRoutes: Router = Router();

activityRoutes.get("/activities", ActivityController.getAllActivities);

activityRoutes.get("/activities/:id", ActivityController.getActivityById);

activityRoutes.post(
  "/activities",
  Authorization.authenticate,
  ActivityValidation.createActivityValidation,
  ActivityController.createActivity
);

activityRoutes.put(
  "/activities/:id",
  Authorization.authenticate,
  Authorization.authorizeActivityManage,
  ActivityValidation.updateActivityValidation,
  ActivityController.updateActivity
);

activityRoutes.delete(
  "/activities/:id",
  Authorization.authenticate,
  Authorization.authorizeActivityManage,
  ActivityController.deleteActivity
);

export default activityRoutes;
