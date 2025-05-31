"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const authuser_1 = require("../controllers/authuser");
const router = express_1.default.Router();
router.post("/signin", authuser_1.signin);
exports.default = router;
