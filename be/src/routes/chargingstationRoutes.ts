import  express from "express";
import { createStation } from "../controllers/createStation";
import { middleware } from "../middlewares/middleware";
import { getStations } from "../controllers/getStation";

const router = express.Router()
router.post("/createstation", middleware, createStation);
router.get("/getstation",getStations);

export default router;