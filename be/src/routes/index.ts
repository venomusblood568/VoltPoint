import express from "express";
import testRoutes from "./testRoutes";
import authRoutes from "./authRoute"
import middlwareRoutes from "./middewareRoute";
import chargingstaionRoutes from "./chargingstationRoutes";

const router = express.Router();

router.use("/", testRoutes);
router.use("/middleware",middlwareRoutes)
router.use("/auth", authRoutes);
router.use("/station",chargingstaionRoutes);
export default router;
