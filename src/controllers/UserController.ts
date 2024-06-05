import { Request, Response } from "express";
import prisma from "../../prisma/client";
import AuthHelper from "../helpers/AuthHelper";
import Helper from "../helpers/Helper";
import cloudinary from "../config/cloudinary";

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
      image: user.image,
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
    let image = null;
    if (req.file?.path) {
      const result = await cloudinary.uploader.upload(req.file.path);
      image = result.secure_url;
    }

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

    console.log(req.body);

    const hashedPass = await AuthHelper.passwordHashing(password);

    const newUser = await prisma.user.create({
      data: {
        username,
        email,
        password: hashedPass,
        fullname,
        phone,
        image,
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
          description: organizationDetail.description,
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

const updateUser = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;

    const user = await prisma.user.findUnique({
      where: {
        id: parseInt(id),
      },
    });

    if (!user) {
      return res.status(404).json({
        status: 404,
        message: "User not found",
      });
    }

    let image = user.image;

    if (image) {
      const urlParts = image.split("/");
      const lastPart = urlParts[urlParts.length - 1];
      const publicId = lastPart.split("/").slice(-1)[0].split(".")[0];

      if (req.file && req.file.path) {
        const result = await cloudinary.uploader.upload(req.file.path);
        image = result.secure_url;

        if (user.image) {
          await cloudinary.uploader.destroy(publicId);
        }
      }
    } else {
      if (req.file && req.file.path) {
        const result = await cloudinary.uploader.upload(req.file.path);
        image = result.secure_url;
      }
    }

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

    const updateUser = await prisma.user.update({
      where: {
        id: parseInt(id),
      },
      data: {
        username,
        email,
        fullname,
        phone,
        image,
        address,
        city,
        role,
      },
    });

    const updateUserData = {
      id: updateUser.id,
      username: updateUser.username,
      email: updateUser.email,
      fullname: updateUser.fullname,
      phone: updateUser.phone,
      image: updateUser.image,
      address: updateUser.address,
      city: updateUser.city,
      role: updateUser.role,
    };

    if (role === "volunteer") {
      const updatedVolunteerDetail = await prisma.volunteerDetail.update({
        where: {
          user_id: updateUser.id,
        },
        data: {
          skills: volunteerDetail.skills,
          education: volunteerDetail.education,
          other_details: volunteerDetail.other_details,
        },
      });

      return res.status(200).json({
        status: true,
        message: "User updated successfully",
        data: {
          ...updateUserData,
          volunteerDetail: updatedVolunteerDetail,
        },
      });
    }

    if (role === "organization") {
      const updatedOrganizationDetail = await prisma.organizationDetail.update({
        where: {
          user_id: updateUser.id,
        },
        data: {
          name: organizationDetail.name,
          address: organizationDetail.address,
          focus: organizationDetail.focus,
          description: organizationDetail.description,
        },
      });

      return res.status(200).json({
        status: true,
        message: "User updated successfully",
        data: {
          ...updateUserData,
          organizationDetail: updatedOrganizationDetail,
        },
      });
    }

    return res.status(200).json({
      status: true,
      message: "User updated successfully",
      data: updateUserData,
    });
  } catch (error) {
    return res.status(500).json({
      status: false,
      message: "An error occurred while updating the user",
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
        image: true,
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
        image: true,
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
        image: true,
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

const getAllActiveUsers = async (req: Request, res: Response) => {
  try {
    const users = await prisma.user.findMany({
      where: {
        status: "active",
      },
      select: {
        id: true,
        username: true,
        email: true,
        fullname: true,
        phone: true,
        image: true,
        address: true,
        city: true,
        role: true,
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
        status: "active",
      },
      select: {
        id: true,
        username: true,
        email: true,
        fullname: true,
        phone: true,
        image: true,
        address: true,
        city: true,
        role: true,
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
    const organizations = await prisma.user.findMany({
      where: {
        role: "organization",
        status: "active",
      },
      select: {
        id: true,
        username: true,
        email: true,
        fullname: true,
        phone: true,
        image: true,
        address: true,
        city: true,
        role: true,
        organizationDetail: true,
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

const logoutUser = async (req: Request, res: Response) => {
  try {
    return res.status(200).json({
      status: true,
      message: "Logout successfully",
    });
  } catch (error) {
    return res.status(500).json({
      status: false,
      message: "An error occurred while logging out",
      error: error,
    });
  }
};

const updatePassword = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const { password } = req.body;
    const user = await prisma.user.findUnique({
      where: {
        id: parseInt(id),
      },
    });

    if (!user) {
      return res.status(404).json({
        status: false,
        message: "User not found",
      });
    }

    const hashedPass = await AuthHelper.passwordHashing(password);

    const updatedUser = await prisma.user.update({
      where: {
        id: parseInt(id),
      },
      data: {
        password: hashedPass,
      },
    });

    return res.status(200).json({
      status: true,
      message: "Password updated successfully",
    });
  } catch (error) {
    return res.status(500).json({
      status: false,
      message: "An error occurred while updating the password",
      error: error,
    });
  }
};

const deleteUser = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const user = await prisma.user.findUnique({
      where: {
        id: parseInt(id),
      },
    });
    if (!user) {
      return res.status(404).json({
        status: false,
        message: "User not found",
      });
    }

    if (user.role === "volunteer") {
      await prisma.volunteerDetail.deleteMany({
        where: {
          user_id: parseInt(id),
        },
      });
    }

    if (user.role === "organization") {
      await prisma.organizationDetail.deleteMany({
        where: {
          user_id: parseInt(id),
        },
      });
    }

    const deletedUser = await prisma.user.delete({
      where: {
        id: parseInt(id),
      },
    });

    return res.status(200).json({
      status: true,
      message: "User deleted successfully",
    });
  } catch (error) {
    return res.status(500).json({
      status: false,
      message: "An error occurred while deleting the user",
      error: error,
    });
  }
};

const softDeleteUser = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const user = await prisma.user.findUnique({
      where: {
        id: parseInt(id),
      },
    });
    if (!user) {
      return res.status(404).json({
        status: false,
        message: "User not found",
      });
    }

    const deletedUser = await prisma.user.update({
      where: {
        id: parseInt(id),
      },
      data: {
        status: "inactive",
      },
    });

    return res.status(200).json({
      status: true,
      message: "User deleted successfully",
    });
  } catch (error) {
    return res.status(500).json({
      status: false,
      message: "An error occurred while deleting the user",
      error: error,
    });
  }
};

export default {
  loginUser,
  registerUser,
  getAllUsers,
  getAllActiveUsers,
  detailSelfUser,
  detailUser,
  getAllVolunteers,
  getAllOrganizations,
  logoutUser,
  updatePassword,
  deleteUser,
  softDeleteUser,
  updateUser,
};
