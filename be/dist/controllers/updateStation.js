"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.updateStation = void 0;
const charging_1 = __importDefault(require("../models/charging"));
const updateStation = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { stationName } = req.params;
    const updateData = req.body;
    try {
        const updatedStation = yield charging_1.default.findOneAndUpdate({ stationName: stationName }, // filter by stationName
        updateData, { new: true } // return the updated document
        );
        if (!updatedStation) {
            res.status(404).json({ message: "Station not found" });
            return;
        }
        res.status(200).json({
            message: "Station updated successfully",
            station: updatedStation,
        });
    }
    catch (error) {
        res.status(400).json({
            message: "Failed to update station",
            error,
        });
    }
});
exports.updateStation = updateStation;
