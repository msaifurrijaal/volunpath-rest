import { Request, Response } from "express";
import prisma from "../../prisma/client";

const getAllCategoryEvents = async (req: Request, res: Response) => {
  try {
    const categories = await prisma.categoryEvent.findMany();
    return res.status(200).json({
      status: true,
      message: "Categories events retrieved successfully",
      data: categories,
    });
  } catch (error) {
    return res.status(500).json({
      status: false,
      message: "An error occurred while retrieving the categories events",
    });
  }
};

export default { getAllCategoryEvents };
