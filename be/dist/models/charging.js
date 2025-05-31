"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const mongoose_1 = __importDefault(require("mongoose"));
const ChargingSchema = new mongoose_1.default.Schema({
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
    createdBy: {
        type: String, // or mongoose.Schema.Types.ObjectId if using ref to user
        required: true,
    },
});
const ChargingStation = mongoose_1.default.model("ChargingStation", ChargingSchema);
exports.default = ChargingStation;
