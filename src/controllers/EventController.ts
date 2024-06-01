import { Request, Response } from "express";
import prisma from "../../prisma/client";

const getAllEvents = async (req: Request, res: Response) => {
  try {
    const events = await prisma.event.findMany({
      include: {
        category: true,
      },
    });
    return res.status(200).json({
      status: true,
      message: "Events retrieved successfully",
      data: events,
    });
  } catch (error) {
    return res.status(500).json({
      status: false,
      message: "An error occurred while retrieving the events",
    });
  }
};

export default { getAllEvents };
