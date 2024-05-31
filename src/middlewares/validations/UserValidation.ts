import { NextFunction, Request, Response } from "express";
import Validator, { Rules } from "validatorjs";
import prisma from "../../../prisma/client";

const registerValidation = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const {
      username,
      email,
      password,
      confirmPassword,
      fullname,
      phone,
      address,
      city,
      role,
      organizationDetail,
      volunteerDetail,
    } = req.body;

    const dataUser = {
      username,
      email,
      password,
      confirmPassword,
      fullname,
      phone,
      address,
      city,
      role,
    };

    const rulesUser: Rules = {
      username: "required|string|max:50",
      email: "required|email",
      password: "required|min:8",
      confirmPassword: "required|same:password",
      fullname: "required|string|max:255",
      phone: "numeric",
      role: "required",
    };

    const validateUser = new Validator(dataUser, rulesUser);

    if (validateUser.fails()) {
      console.log("2 :" + JSON.stringify(validateUser.errors));
      return res.status(400).json({
        status: 400,
        message: "Bad Request",
        errors: validateUser.errors,
      });
    }

    if (role === "volunteer") {
      const volunteerData = volunteerDetail;
      const rulesVolunteer: Rules = {
        skills: "required|string",
        education: "string",
        other_details: "string",
      };

      const validateVolunteer = new Validator(volunteerData, rulesVolunteer);
      if (validateVolunteer.fails()) {
        return res.status(400).json({
          status: 400,
          message: "Bad Request",
          errors: validateVolunteer.errors,
        });
      }
    }

    if (role === "mitra") {
      const mitraData = organizationDetail;
      const rulesMitra: Rules = {
        name: "required|string|max:255",
        address: "required|string|max:255",
        focus: "required|string|max:50",
      };

      const validateMitra = new Validator(mitraData, rulesMitra);
      if (validateMitra.fails()) {
        return res.status(400).json({
          status: 400,
          message: "Bad Request",
          errors: validateMitra.errors,
        });
      }
    }

    const userEmail = await prisma.user.findUnique({
      where: {
        email: dataUser.email,
      },
    });

    if (userEmail) {
      return res.status(400).json({
        status: 400,
        message: "Bad Request",
        errors: "Email already used",
      });
    }

    const userUsername = await prisma.user.findUnique({
      where: {
        username: dataUser.username,
      },
    });

    if (userUsername) {
      return res.status(400).json({
        status: 400,
        message: "Bad Request",
        errors: "Username already used",
      });
    }
    next();
  } catch (error) {
    return res.status(5000).json({
      status: 500,
      message: "An error occurred while registering the user",
      errors: error,
    });
  }
};

export default {
  registerValidation,
};
