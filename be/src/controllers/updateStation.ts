import { Request, Response } from "express";
import ChargingStation from "../models/charging";

export const updateStation = async (req: Request, res: Response) => {
  const { stationName } = req.params;
  const updateData = req.body;

  try {
    const updatedStation = await ChargingStation.findOneAndUpdate(
      { stationName: stationName }, // filter by stationName
      updateData,
      { new: true } // return the updated document
    );

    if (!updatedStation) {
      res.status(404).json({ message: "Station not found" });
      return;
    }

    res.status(200).json({
      message: "Station updated successfully",
      station: updatedStation,
    });
  } catch (error) {
    res.status(400).json({
      message: "Failed to update station",
      error,
    });
  }
};
