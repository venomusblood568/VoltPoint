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
exports.createStation = void 0;
const charging_1 = __importDefault(require("../models/charging"));
const createStation = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    var _a, _b, _c;
    try {
        const newStation = new charging_1.default(Object.assign(Object.assign({}, req.body), { createdBy: (_a = req.user) === null || _a === void 0 ? void 0 : _a.id }));
        const savedStation = yield newStation.save();
        res.status(200).json({
            message: "New station created successfully",
            station: savedStation,
            createdBy: {
                id: (_b = req.user) === null || _b === void 0 ? void 0 : _b.id,
                username: (_c = req.user) === null || _c === void 0 ? void 0 : _c.username,
            },
        });
    }
    catch (error) {
        res.status(400).json({
            message: "Something went wrong",
            error,
        });
    }
});
exports.createStation = createStation;
