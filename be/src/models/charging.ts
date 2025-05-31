import mongoose from "mongoose";

const ChargingSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
  },
  location: {
    latitude: { type: Number, required: true },
    longitude: { type: Number, required: true },
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
});

const ChargingStation = mongoose.model("ChargingStation", ChargingSchema);
export default ChargingStation;