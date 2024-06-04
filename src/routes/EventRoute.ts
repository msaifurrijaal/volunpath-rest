import { Router } from "express";
import EventController from "../controllers/EventController";
import Authorization from "../middlewares/Authorization";
import upload from "../middlewares/multer";

const eventRoutes: Router = Router();

eventRoutes.get(
  "/events",
  Authorization.authenticate,
  EventController.getAllEvents
);

eventRoutes.post(
  "/events",
  Authorization.authenticate,
  Authorization.authorizeEventManage,
  upload.single("image"),
  EventController.createEvent
);

eventRoutes.get(
  "/events/:id",
  Authorization.authenticate,
  EventController.getEventById
);

eventRoutes.put(
  "/events/:id",
  Authorization.authenticate,
  Authorization.authorizeEventManage,
  upload.single("image"),
  EventController.updateEvent
);

eventRoutes.patch(
  "/events/:id",
  Authorization.authenticate,
  Authorization.authorizeEventManage,
  EventController.updateEventStatus
);

eventRoutes.delete(
  "/events/:id",
  Authorization.authenticate,
  Authorization.authorizeEventManage,
  EventController.deleteEvent
);

eventRoutes.get(
  "/category-events",
  Authorization.authenticate,
  EventController.getAllCategoryEvents
);

export default eventRoutes;
