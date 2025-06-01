"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const mongoose_1 = __importDefault(require("mongoose"));
const ChargingSchema = new mongoose_1.default.Schema({
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
        type: mongoose_1.default.Schema.Types.ObjectId,
        ref: "User",
        required: true,
    },
});
const ChargingStation = mongoose_1.default.model("ChargingStation", ChargingSchema);
exports.default = ChargingStation;
