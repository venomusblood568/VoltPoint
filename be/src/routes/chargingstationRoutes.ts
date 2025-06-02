import express from "express";
import { createStation } from "../controllers/createStation";
import { middleware } from "../middlewares/middleware";
import { liststation } from "../controllers/liststation";
import { deleteStation } from "../controllers/deleteStation";
import { updateStation } from "../controllers/updateStation";

const router = express.Router();
router.post("/createstation", middleware, createStation);
router.post("/getstation",liststation)
router.put("/updatestation/:stationName", middleware, updateStation);
router.post("/deletestation", middleware, deleteStation);

export default router;
