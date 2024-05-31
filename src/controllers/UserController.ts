import { Request, Response } from "express";
import prisma from "../../prisma/client";
import AuthHelper from "../helpers/AuthHelper";

const loginUser = async (req: Request, res: Response) => {
  const login = await prisma.user.findUnique;
  return res.json("Test");
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
        status: 201,
        message: "User registered successfully",
        user: {
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

    if (role === "mitra") {
      const newMitraDetail = await prisma.organizationDetail.create({
        data: {
          user_id: newUser.id,
          name: organizationDetail.name,
          address: organizationDetail.address,
          focus: organizationDetail.focus,
        },
      });

      return res.status(201).json({
        status: 201,
        message: "User registered successfully",
        user: {
          id: newUser.id,
          username: newUser.username,
          email: newUser.email,
          fullname: newUser.fullname,
          phone: newUser.phone,
          address: newUser.address,
          city: newUser.city,
          role: newUser.role,
          organizationDetail: newMitraDetail,
        },
      });
    }

    return res.status(201).json({
      status: 201,
      message: "User registered successfully",
      user: {
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
      status: 500,
      message: "An error occurred while registering the user",
      error: error,
    });
  }
};

const getAllUsers = async (req: Request, res: Response) => {
  try {
    const users = await prisma.user.findMany({
      include: {
        volunteerDetail: true,
        organization: true,
      },
    });
    return res.status(200).json(users);
  } catch (error) {
    return res.status(500).json({
      status: 500,
      message: "An error occurred while retrieving the users",
      error: error,
    });
  }
};

export default {
  loginUser,
  registerUser,
  getAllUsers,
};