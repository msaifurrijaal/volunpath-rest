import { NextFunction, Request, Response } from "express";
import Validator, { Rules } from "validatorjs";
import prisma from "../../../prisma/client";

const createActivityValidation = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const { volunteer_id, event_id, motivation, additional_info } = req.body;
    const dataActivity = {
      volunteer_id,
      event_id,
      motivation,
      additional_info,
    };
    const rulesActivity: Rules = {
      volunteer_id: "required|numeric",
      event_id: "required|numeric",
      motivation: "required|string",
      additional_info: "string",
    };
    const validateActivity = new Validator(dataActivity, rulesActivity);
    if (validateActivity.fails()) {
      return res.status(400).json({
        status: false,
        message: "Bad Request",
        errors: validateActivity.errors,
      });
    }
    console.log("berhasil");

    const isRegistered = await prisma.activity.findMany({
      where: {
        volunteer_id: parseInt(volunteer_id),
        event_id: parseInt(event_id),
      },
    });

    if (isRegistered.length > 0) {
      return res.status(400).json({
        status: false,
        message: "Activity already registered",
      });
    }

    next();
  } catch (error) {
    return res.status(500).json({
      status: false,
      message: "An error occurred while validating the activity data",
      error: error,
    });
  }
};

const updateActivityValidation = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const activityId = parseInt(req.params.id);
    const {
      volunteer_id,
      event_id,
      status,
      statusPayment,
      motivation,
      additional_info,
    } = req.body;
    const dataActivity = {
      volunteer_id,
      event_id,
      status,
      statusPayment,
      motivation,
      additional_info,
    };
    const rulesActivity: Rules = {
      volunteer_id: "required|numeric",
      event_id: "required|numeric",
      status: "required|string",
      statusPayment: "required|string",
      motivation: "required|string",
      additional_info: "string",
    };

    const validateActivity = new Validator(dataActivity, rulesActivity);
    if (validateActivity.fails()) {
      return res.status(400).json({
        status: false,
        message: "Bad Request",
        errors: validateActivity.errors,
      });
    }

    const isRegistered = await prisma.activity.findFirst({
      where: {
        volunteer_id: parseInt(volunteer_id),
        event_id: parseInt(event_id),
      },
    });

    if (isRegistered?.id !== activityId) {
      return res.status(400).json({
        status: false,
        message:
          "The event_id and volunteer_id data are already used in other Activity",
      });
    }

    next();
  } catch (error) {
    return res.status(500).json({
      status: false,
      error: error,
    });
  }
};

export default {
  createActivityValidation,
  updateActivityValidation,
};
