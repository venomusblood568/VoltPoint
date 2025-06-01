import { Request, Response } from "express";
import ChargingStation from "../models/charging";


export const deleteStation = async (req: Request, res: Response) => {
  try {
    const { stationName } = req.body;
    const userId = req.user?.id;

    const station = await ChargingStation.findOne({
      stationName,
    });

    if(!station){
        res.status(400).json({message:"Station not found"});
        return;
    }

    if (station.createdBy.toString() !== userId){
        res
          .status(403)
          .json({ message: "You are not authorized to delete this station." });
          return
    }

    await ChargingStation.deleteOne({stationName});
    res.status(200).json({ messgae: "Station deleted successfully" });
  } catch (error) {
    res.status(500).json({ message: "Error deleting station", error });
  }
};
