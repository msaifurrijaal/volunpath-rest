import { Request, Response } from "express";
import prisma from "../../prisma/client";

const getVolunteerActivities = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const activities = await prisma.activity.findMany({
      where: {
        volunteer_id: parseInt(id),
      },
      include: {
        event: true,
        volunteer: {
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
            created_at: true,
            updated_at: true,
          },
        },
      },
    });

    return res.status(200).json({
      status: true,
      message: "Activities retrieved successfully",
      data: activities,
    });
  } catch (error) {
    return res.status(500).json({
      status: false,
      message: "An error occurred while retrieving the activities",
      error: error,
    });
  }
};

export default { getVolunteerActivities };
