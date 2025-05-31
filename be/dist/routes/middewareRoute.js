"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const middleware_1 = require("../middlewares/middleware");
const router = express_1.default.Router();
// Protected route
router.get("/protected", middleware_1.middleware, (req, res) => {
    res.status(200).json({
        message: "✅ Access granted to protected route",
        userId: req.userId,
    });
});
exports.default = router;
