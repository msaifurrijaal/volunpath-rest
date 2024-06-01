import { Request, Response } from "express";
import prisma from "../../prisma/client";
import AuthHelper from "../helpers/AuthHelper";
import Helper from "../helpers/Helper";

const loginUser = async (req: Request, res: Response) => {
  try {
    const { email, password } = req.body;
    const user = await prisma.user.findUnique({
      where: {
        email: email,
      },
    });

    if (!user) {
      return res.status(401).json({
        status: false,
        message: "Unauthorized",
      });
    }

    const matched = await AuthHelper.passwordCompare(password, user.password);

    if (!matched) {
      return res.status(401).json({
        status: false,
        message: "Unauthorized",
      });
    }

    const dataUser = {
      id: user.id,
      username: user.username,
      email: user.email,
      role: user.role,
      status: user.status,
    };

    const token = Helper.generateToken(dataUser);
    const refreshToken = Helper.generateRefreshToken(dataUser);

    const responseUser = {
      id: user.id,
      username: user.username,
      email: user.email,
      role: user.role,
      status: user.status,
      fullname: user.fullname,
      phone: user.phone,
      address: user.address,
      city: user.city,
      token: token,
      refreshToken: refreshToken,
    };

    return res.status(200).json({
      status: true,
      message: "Login Success",
      data: responseUser,
    });
  } catch (error) {
    return res.status(500).json({
      status: false,
      message: "An error occurred while logging in the user",
      error: error,
    });
  }
};

const registerUser = async (req: Request, res: Response) => {
  try {
    const {
      username,
      email,
      password,
      fullname,
      phone,
      address,
      city,
      role,
      organizationDetail,
      volunteerDetail,
    } = req.body;

    const hashedPass = await AuthHelper.passwordHashing(password);

    const newUser = await prisma.user.create({
      data: {
        username,
        email,
        password: hashedPass,
        fullname,
        phone,
        address,
        city,
        role,
        status: "active",
      },
    });

    if (role === "volunteer") {
      const newVolunteerDetail = await prisma.volunteerDetail.create({
        data: {
          user_id: newUser.id,
          skills: volunteerDetail.skills,
          education: volunteerDetail.education,
          other_details: volunteerDetail.other_details,
        },
      });

      return res.status(201).json({
        status: true,
        message: "User registered successfully",
        data: {
          id: newUser.id,
          username: newUser.username,
          email: newUser.email,
          fullname: newUser.fullname,
          phone: newUser.phone,
          address: newUser.address,
          city: newUser.city,
          role: newUser.role,
          volunteerDetail: newVolunteerDetail,
        },
      });
    }

    if (role === "organization") {
      const newOrganizationDetail = await prisma.organizationDetail.create({
        data: {
          user_id: newUser.id,
          name: organizationDetail.name,
          address: organizationDetail.address,
          focus: organizationDetail.focus,
        },
      });

      return res.status(201).json({
        status: true,
        message: "User registered successfully",
        data: {
          id: newUser.id,
          username: newUser.username,
          email: newUser.email,
          fullname: newUser.fullname,
          phone: newUser.phone,
          address: newUser.address,
          city: newUser.city,
          role: newUser.role,
          organizationDetail: newOrganizationDetail,
        },
      });
    }

    return res.status(201).json({
      status: true,
      message: "User registered successfully",
      data: {
        id: newUser.id,
        username: newUser.username,
        email: newUser.email,
        fullname: newUser.fullname,
        phone: newUser.phone,
        address: newUser.address,
        city: newUser.city,
        role: newUser.role,
      },
    });
  } catch (error) {
    return res.status(500).json({
      status: false,
      message: "An error occurred while registering the user",
      error: error,
    });
  }
};

const detailSelfUser = async (req: Request, res: Response) => {
  try {
    const authToken = req.headers["authorization"];
    const token = authToken && authToken.split(" ")[1];

    const decoded = Helper.extractToken(token!);
    const email = decoded!.email;

    if (!email) {
      return res.status(401).json({
        status: false,
        message: "Unauthorized",
      });
    }

    const user = await prisma.user.findUnique({
      where: {
        email: email,
      },
      select: {
        id: true,
        username: true,
        email: true,
        fullname: true,
        phone: true,
        address: true,
        city: true,
        role: true,
        status: true,
        organizationDetail: true,
        volunteerDetail: true,
        created_at: true,
        updated_at: true,
      },
    });

    if (!user) {
      return res.status(404).json({
        status: false,
        message: "User not found",
      });
    }

    return res.status(200).json({
      status: true,
      message: "User retrieved successfully",
      data: user,
    });
  } catch (error) {
    return res.status(500).json({
      status: false,
      message: "An error occurred while retrieving the user",
      error: error,
    });
  }
};

const detailUser = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const user = await prisma.user.findUnique({
      where: {
        id: parseInt(id),
      },
      select: {
        id: true,
        username: true,
        email: true,
        fullname: true,
        phone: true,
        address: true,
        city: true,
        role: true,
        status: true,
        organizationDetail: true,
        volunteerDetail: true,
        created_at: true,
        updated_at: true,
      },
    });

    if (!user) {
      return res.status(404).json({
        status: false,
        message: "User not found",
      });
    }

    return res.status(200).json({
      status: true,
      message: "User retrieved successfully",
      data: user,
    });
  } catch (error) {
    return res.status(500).json({
      status: false,
      message: "An error occurred while retrieving the user",
      error: error,
    });
  }
};

const getAllUsers = async (req: Request, res: Response) => {
  try {
    const users = await prisma.user.findMany({
      select: {
        id: true,
        username: true,
        email: true,
        fullname: true,
        phone: true,
        address: true,
        city: true,
        role: true,
        status: true,
        organizationDetail: true,
        volunteerDetail: true,
        created_at: true,
        updated_at: true,
      },
    });
    return res.status(200).json({
      status: true,
      message: "Users retrieved successfully",
      data: users,
    });
  } catch (error) {
    return res.status(500).json({
      status: false,
      message: "An error occurred while retrieving the users",
      error: error,
    });
  }
};

const getAllVolunteers = async (req: Request, res: Response) => {
  try {
    const users = await prisma.user.findMany({
      where: {
        role: "volunteer",
      },
      select: {
        id: true,
        username: true,
        email: true,
        fullname: true,
        phone: true,
        address: true,
        city: true,
        role: true,
        status: true,
        volunteerDetail: true,
        created_at: true,
        updated_at: true,
      },
    });

    if (!users) {
      return res.status(404).json({
        status: false,
        message: "Volunteers not found",
      });
    }

    return res.status(200).json({
      status: true,
      message: "Volunteers retrieved successfully",
      data: users,
    });
  } catch (error) {
    return res.status(500).json({
      status: false,
      message: "An error occurred while retrieving the users",
      error: error,
    });
  }
};

const getAllOrganizations = async (req: Request, res: Response) => {
  try {
    const organizations = await prisma.organizationDetail.findMany({
      select: {
        id: true,
        name: true,
        address: true,
        focus: true,
        created_at: true,
        updated_at: true,
      },
    });
    if (!organizations) {
      return res.status(404).json({
        status: false,
        message: "Organizations not found",
      });
    }
    return res.status(200).json({
      status: true,
      message: "Organizations retrieved successfully",
      data: organizations,
    });
  } catch (error) {
    return res.status(500).json({
      status: false,
      message: "An error occurred while retrieving the organizations",
      error: error,
    });
  }
};

export default {
  loginUser,
  registerUser,
  getAllUsers,
  detailSelfUser,
  detailUser,
  getAllVolunteers,
  getAllOrganizations,
};
