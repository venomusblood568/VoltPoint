import express from "express";
import testRoutes from "./testRoutes";
import authRoutes from "./authRoute"
import middlwareRoutes from "./middewareRoute";
const router = express.Router();

router.use("/", testRoutes);
router.use("/middleware",middlwareRoutes)
router.use("/auth", authRoutes);
export default router;
