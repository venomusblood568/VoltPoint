"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const signupuser_1 = require("../controllers/signupuser");
const signinuser_1 = require("../controllers/signinuser");
const router = express_1.default.Router();
router.post("/signup", signupuser_1.signup);
router.post("/signin", signinuser_1.signin);
exports.default = router;
