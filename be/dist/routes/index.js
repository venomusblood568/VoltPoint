"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const testRoutes_1 = __importDefault(require("./testRoutes"));
const authRoute_1 = __importDefault(require("./authRoute"));
const middewareRoute_1 = __importDefault(require("./middewareRoute"));
const chargingstationRoutes_1 = __importDefault(require("./chargingstationRoutes"));
const router = express_1.default.Router();
router.use("/", testRoutes_1.default);
router.use("/middleware", middewareRoute_1.default);
router.use("/auth", authRoute_1.default);
router.use("/station", chargingstationRoutes_1.default);
exports.default = router;
