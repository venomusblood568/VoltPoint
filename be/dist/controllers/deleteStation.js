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
exports.deleteStaion = void 0;
const charging_1 = __importDefault(require("../models/charging"));
const deleteStaion = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    var _a;
    try {
        const { stationName } = req.body;
        const userId = (_a = req.user) === null || _a === void 0 ? void 0 : _a.id;
        const station = yield charging_1.default.findOne({
            stationName,
        });
        if (!station) {
            res.status(400).json({ message: "Station not found" });
            return;
        }
        if (station.createdBy.toString() !== userId) {
            res
                .status(403)
                .json({ message: "You are not authorized to delete this station." });
            return;
        }
        yield charging_1.default.deleteOne({ stationName });
        res.status(200).json({ messgae: "Station deleted successfully" });
    }
    catch (error) {
        res.status(500).json({ message: "Error deleting station", error });
    }
});
exports.deleteStaion = deleteStaion;
