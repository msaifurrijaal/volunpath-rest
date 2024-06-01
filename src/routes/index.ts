import { Router } from "express";
import userRoutes from "./UserRoute";
import organizationRoutes from "./OrganizationRoute";
import volunteerRoutes from "./VolunteerRoute";
import eventRoutes from "./EventRoute";
import categoryEventRoutes from "./CategoryEventRoute";

const rootRouter: Router = Router();

rootRouter.use("/", userRoutes);
rootRouter.use("/", organizationRoutes);
rootRouter.use("/", volunteerRoutes);
rootRouter.use("/", eventRoutes);
rootRouter.use("/", categoryEventRoutes);

export default rootRouter;
