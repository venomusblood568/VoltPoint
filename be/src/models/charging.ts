import mongoose from "mongoose";

const ChargingSchema = new mongoose.Schema({
  createrUsername: {
    type: String,
    require: true,
  },
  stationName: {
    type: String,
    required: true,
    unique: true,
  },
  location: {
    latitude: { type: Number, required: true, unique: true },
    longitude: { type: Number, required: true, unique: true },
  },
  status: {
    type: String,
    enum: ["Active", "Inactive"],
    required: true,
  },
  powerOutput: {
    type: Number,
    required: true,
  },
  connectorType: {
    type: String,
    enum: ["Type1", "Type2"],
    required: true,
  },
  createdBy: { 
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
    required: true,
  },
});

const ChargingStation = mongoose.model("ChargingStation", ChargingSchema);
export default ChargingStation;