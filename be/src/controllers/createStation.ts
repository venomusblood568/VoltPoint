import { Request, Response } from "express";
import ChargingStation from "../models/charging";


export const createStation = async (
  req: Request,
  res: Response
): Promise<void> => {
  try {
    const newStation = new ChargingStation({
      ...req.body,
      createdBy: req.user?.id, 
    });

    const savedStation = await newStation.save();
    res.status(200).json({
      message: "New station created successfully",
      station: savedStation,
      createdBy: {
        id: req.user?.id,
        username: req.user?.username,
      },
    });
  } catch (error) {
    res.status(400).json({
      message: "Something went wrong",
      error,
    });
  }
};
