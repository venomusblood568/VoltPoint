import { Request, Response } from "express";
import ChargingStation from "../models/charging";

export const liststation = async (req: Request, res: Response) => {
  try {
    const stations = await ChargingStation.find()
    res.status(200).json({
      message: "Fetched all the stations",
      stations:stations
    });
  } catch (error) {
    res.status(500).json({
      message: "Error fetching stations",
      error,
    });
  }
};
