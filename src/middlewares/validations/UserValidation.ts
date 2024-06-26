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
      address: "string",
      city: "string",
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

    if (role === "organization") {
      const organizationData = organizationDetail;
      const rulesOrganization: Rules = {
        name: "required|string|max:255",
        address: "required|string|max:255",
        focus: "required|string|max:50",
      };

      const validateOrganization = new Validator(
        organizationData,
        rulesOrganization
      );
      if (validateOrganization.fails()) {
        return res.status(400).json({
          status: 400,
          message: "Bad Request",
          errors: validateOrganization.errors,
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

const loginValidation = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const { email, password } = req.body;

    const dataUser = { email, password };

    const rulesUser: Rules = {
      email: "required|email",
      password: "required|min:8",
    };

    const validateUser = new Validator(dataUser, rulesUser);

    if (validateUser.fails()) {
      return res.status(400).json({
        status: false,
        message: "Bad Request",
        errors: validateUser.errors,
      });
    }

    next();
  } catch (error) {
    return res.status(500).json({
      status: false,
      message: "An error occurred while validating the login data",
      error: error,
    });
  }
};

const updateUserValidation = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const {
      username,
      email,
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
      fullname,
      phone,
      address,
      city,
      role,
    };
    const rulesUser: Rules = {
      username: "required|string|max:50",
      email: "required|email",
      fullname: "required|string|max:255",
      phone: "numeric",
      address: "string",
      city: "string",
      role: "required",
    };
    const validateUser = new Validator(dataUser, rulesUser);
    if (validateUser.fails()) {
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
        education: "required|string",
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

    if (role === "organization") {
      const organizationData = organizationDetail;
      const rulesOrganization: Rules = {
        name: "required|string|max:255",
        address: "required|string|max:255",
        focus: "required|string|max:50",
        description: "string",
      };
      const validateOrganization = new Validator(
        organizationData,
        rulesOrganization
      );
      if (validateOrganization.fails()) {
        return res.status(400).json({
          status: 400,
          message: "Bad Request",
          errors: validateOrganization.errors,
        });
      }
    }

    next();
  } catch (error) {
    return res.status(500).json({
      status: 500,
      message: "An error occurred while processing your request",
      error: error,
    });
  }
};

const updatePasswordValidation = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const { password } = req.body;
    const dataUser = {
      password,
    };
    const rulesUser: Rules = {
      password: "required|min:8",
    };
    const validateUser = new Validator(dataUser, rulesUser);
    if (validateUser.fails()) {
      return res.status(400).json({
        status: 400,
        message: "Bad Request",
        errors: validateUser.errors,
      });
    }

    next();
  } catch (error) {
    return res.status(500).json({
      status: 500,
      message: "An error occurred while processing your request",
      error: error,
    });
  }
};

export default {
  registerValidation,
  loginValidation,
  updatePasswordValidation,
  updateUserValidation,
};
