import { Router } from "express";
import userRoutes from "./UserRoute";

const rootRouter: Router = Router();

rootRouter.use("/", userRoutes);

export default rootRouter;
