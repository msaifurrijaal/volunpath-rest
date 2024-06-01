import { Request, Response, NextFunction } from "express";
import Helper from "../helpers/Helper";

const authenticate = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const authToken = req.headers["authorization"];
    const token = authToken && authToken.split(" ")[1];

    if (token === null) {
      return res.status(401).json({
        status: false,
        message: "Unauthorized",
      });
    }

    const result = Helper.extractToken(token!);
    if (!result) {
      return res.status(401).json({
        status: false,
        message: "Unauthorized",
      });
    }

    next();
  } catch (error) {
    return res.status(500).json({
      status: false,
      errors: error,
    });
  }
};

export default { authenticate };