import { NextFunction, Request, Response } from "express";
import Validator, { Rules } from "validatorjs";

const createEventValidation = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const {
      title,
      description,
      additional_info,
      date,
      location,
      slots_needed,
      slots_available,
      category_id,
      image,
    } = req.body;

    const dataEvent = {
      title,
      description,
      additional_info,
      date,
      location,
      slots_needed,
      slots_available,
      category_id,
      image,
    };

    const rulesEvent: Rules = {
      title: "required|string",
      description: "required|string",
      additional_info: "string",
      date: "required|date",
      location: "required|string",
      slots_needed: "required|numeric",
      slots_available: "required|numeric",
      category_id: "required|numeric",
      image: "string",
    };

    const validateEvent = new Validator(dataEvent, rulesEvent);
    if (validateEvent.fails()) {
      return res.status(400).json({
        status: false,
        message: "Bad Request",
        errors: validateEvent.errors,
      });
    }
    next();
  } catch (error) {
    return res.status(500).json({
      status: false,
      message: "An error occurred while validating the event data",
      error: error,
    });
  }
};

export default { createEventValidation };
