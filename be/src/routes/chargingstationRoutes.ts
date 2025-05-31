import  express from "express";
import { createStation } from "../controllers/createStation";
import { middleware } from "../middlewares/middleware";

const router = express.Router()
router.post("/createstation", middleware, createStation);

export default router;