import { Request, Response } from "express";
import prisma from "../../prisma/client";
import cloudinary from "../config/cloudinary";

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

const createEvent = async (req: Request, res: Response) => {
  try {
    if (!req.file || !req.file.path) {
      return res.status(400).json({
        status: false,
        message: "No image file provided",
      });
    }

    const result = await cloudinary.uploader.upload(req.file.path);
    const image = result.url;

    const {
      organizer_id,
      title,
      description,
      additional_info,
      date,
      location,
      slots_needed,
      slots_available,
      category_id,
    } = req.body;

    const event = await prisma.event.create({
      data: {
        organizer_id: parseInt(organizer_id),
        title,
        description,
        additional_info,
        date: new Date(date),
        location,
        slots_needed: parseInt(slots_needed),
        slots_available: parseInt(slots_available),
        category_id: parseInt(category_id),
        status: "open_registration",
        image,
      },
    });

    return res.status(201).json({
      status: true,
      message: "Event created successfully",
      data: event,
    });
  } catch (error) {
    return res.status(500).json({
      status: false,
      message: "An error occurred while creating the event",
      error: error,
    });
  }
};

const getEventById = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const event = await prisma.event.findUnique({
      where: {
        id: parseInt(id),
      },
      include: {
        category: true,
      },
    });
    if (!event) {
      return res.status(404).json({
        status: false,
        message: "Event not found",
      });
    }

    return res.status(200).json({
      status: true,
      message: "Event retrieved successfully",
      data: event,
    });
  } catch (error) {
    return res.status(500).json({
      status: false,
      message: "An error occurred while retrieving the event",
      error: error,
    });
  }
};

const updateEvent = async (req: Request, res: Response) => {
  try {
    const eventId = parseInt(req.params.id);
    const event = await prisma.event.findUnique({ where: { id: eventId } });

    if (!event) {
      return res.status(404).json({
        status: false,
        message: "Event not found",
      });
    }

    let image = event.image;

    if (image) {
      const urlParts = image.split("/");
      const lastPart = urlParts[urlParts.length - 1];
      const publicId = lastPart.split("/").slice(-1)[0].split(".")[0];

      if (req.file && req.file.path) {
        const result = await cloudinary.uploader.upload(req.file.path);
        image = result.url;

        if (event.image) {
          await cloudinary.uploader.destroy(publicId);
        }
      }
    } else {
      if (req.file && req.file.path) {
        const result = await cloudinary.uploader.upload(req.file.path);
        image = result.url;
      }
    }

    const {
      organizer_id,
      title,
      description,
      additional_info,
      date,
      location,
      slots_needed,
      slots_available,
      category_id,
      status,
    } = req.body;

    const updatedEvent = await prisma.event.update({
      where: { id: eventId },
      data: {
        organizer_id: parseInt(organizer_id),
        title,
        description,
        additional_info,
        date: new Date(date),
        location,
        slots_needed: parseInt(slots_needed),
        slots_available,
        category_id: parseInt(category_id),
        image,
        status,
      },
    });

    return res.status(200).json({
      status: true,
      message: "Event updated successfully",
      data: updatedEvent,
    });
  } catch (error) {
    return res.status(500).json({
      status: false,
      message: "An error occurred while updating the event",
      error: error,
    });
  }
};

const updateEventStatus = async (req: Request, res: Response) => {
  try {
    const eventId = parseInt(req.params.id);
    const { status } = req.body;

    const event = await prisma.event.findUnique({ where: { id: eventId } });

    if (!event) {
      return res.status(404).json({
        status: false,
        message: "Event not found",
      });
    }

    const updatedEvent = await prisma.event.update({
      where: { id: eventId },
      data: {
        status,
      },
    });

    return res.status(200).json({
      status: true,
      message: "Event status updated successfully",
      data: updatedEvent,
    });
  } catch (error) {
    return res.status(500).json({
      status: false,
      message: "An error occurred while updating the event status",
      error: error,
    });
  }
};

const deleteEvent = async (req: Request, res: Response) => {
  try {
    const eventId = parseInt(req.params.id);
    const event = await prisma.event.findUnique({ where: { id: eventId } });
    if (!event) {
      return res.status(404).json({
        status: false,
        message: "Event not found",
      });
    }

    if (event.image) {
      const urlParts = event.image.split("/");
      const lastPart = urlParts[urlParts.length - 1];
      const publicId = lastPart.split("/").slice(-1)[0].split(".")[0];
      await cloudinary.uploader.destroy(publicId);
    }

    await prisma.event.delete({ where: { id: eventId } });
    return res.status(200).json({
      status: true,
      message: "Event deleted successfully",
    });
  } catch (error) {
    return res.status(500).json({
      status: false,
      message: "An error occurred while deleting the event",
      error: error,
    });
  }
};

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

export default {
  getAllEvents,
  createEvent,
  getEventById,
  updateEvent,
  updateEventStatus,
  deleteEvent,
  getAllCategoryEvents,
};
