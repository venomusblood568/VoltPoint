"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const createStation_1 = require("../controllers/createStation");
const middleware_1 = require("../middlewares/middleware");
const router = express_1.default.Router();
router.post("/createstation", middleware_1.middleware, createStation_1.createStation);
exports.default = router;
