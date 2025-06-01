import  express from "express";
import { createStation } from "../controllers/createStation";
import { middleware } from "../middlewares/middleware";
import { getStations } from "../controllers/getstation";
import { deleteStaion } from "../controllers/deleteStation";

const router = express.Router()
router.post("/createstation", middleware, createStation);
router.get("/getstation",getStations);

router.post("/deletestation", middleware, deleteStaion);

export default router;