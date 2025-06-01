"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const createStation_1 = require("../controllers/createStation");
const middleware_1 = require("../middlewares/middleware");
const getstation_1 = require("../controllers/getstation");
const deleteStation_1 = require("../controllers/deleteStation");
const router = express_1.default.Router();
router.post("/createstation", middleware_1.middleware, createStation_1.createStation);
router.get("/getstation", getstation_1.getStations);
router.post("/deletestation", middleware_1.middleware, deleteStation_1.deleteStation);
exports.default = router;
