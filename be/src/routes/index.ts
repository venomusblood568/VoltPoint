import express from "express";
import testRoutes from "./testRoutes";
import authRoutes from "./authRoute"
const router = express.Router();

router.use("/", testRoutes);
router.use("/auth", authRoutes);
export default router;
