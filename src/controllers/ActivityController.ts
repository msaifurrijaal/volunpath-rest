import { Request, Response } from "express";
import prisma from "../../prisma/client";
import cloudinary from "../config/cloudinary";

const getAllActivities = async (req: Request, res: Response) => {
  try {
    const activities = await prisma.activity.findMany({
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
    });
  }
};

const getActivityById = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const activity = await prisma.activity.findUnique({
      where: {
        id: parseInt(id),
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
    if (!activity) {
      return res.status(404).json({
        status: false,
        message: "Activity not found",
      });
    }

    return res.status(200).json({
      status: true,
      message: "Activity retrieved successfully",
      data: activity,
    });
  } catch (error) {
    return res.status(500).json({
      status: false,
      message: "An error occurred while retrieving the activity",
    });
  }
};

const createActivity = async (req: Request, res: Response) => {
  try {
    const { event_id, volunteer_id, motivation, additional_info } = req.body;
    const activity = await prisma.activity.create({
      data: {
        event_id: parseInt(event_id),
        volunteer_id: parseInt(volunteer_id),
        status: "pending",
        statusPayment: "pending",
        motivation,
        additional_info,
      },
    });
    return res.status(201).json({
      status: true,
      message: "Activity created successfully",
      data: activity,
    });
  } catch (error) {
    return res.status(500).json({
      status: false,
      message: "An error occurred while creating the activity",
    });
  }
};

const updateActivity = async (req: Request, res: Response) => {
  try {
    const activityId = parseInt(req.params.id);

    const activity = await prisma.activity.findUnique({
      where: {
        id: activityId,
      },
    });

    if (!activity) {
      return res.status(404).json({
        status: false,
        message: "Activity not found",
      });
    }

    const {
      volunteer_id,
      event_id,
      status,
      statusPayment,
      motivation,
      additional_info,
    } = req.body;

    const updatedActivity = await prisma.activity.update({
      where: {
        id: activityId,
      },
      data: {
        volunteer_id: parseInt(volunteer_id),
        event_id: parseInt(event_id),
        status,
        statusPayment,
        motivation,
        additional_info,
      },
    });
    return res.status(200).json({
      status: true,
      message: "Activity updated successfully",
      data: updatedActivity,
    });
  } catch (error) {
    return res.status(500).json({
      status: false,
      message: "An error occurred while updating the activity",
    });
  }
};

const deleteActivity = async (req: Request, res: Response) => {
  try {
    const activityId = parseInt(req.params.id);
    const activity = await prisma.activity.findUnique({
      where: {
        id: activityId,
      },
    });
    if (!activity) {
      return res.status(404).json({
        status: false,
        message: "Activity not found",
      });
    }

    const deletedActivity = await prisma.activity.delete({
      where: {
        id: activityId,
      },
    });
    return res.status(200).json({
      status: true,
      message: "Activity deleted successfully",
      data: deletedActivity,
    });
  } catch (error) {
    return res.status(500).json({
      status: false,
      message: "An error occurred while deleting the activity",
    });
  }
};

export default {
  getAllActivities,
  getActivityById,
  createActivity,
  updateActivity,
  deleteActivity,
};
