import express, { Request, Response } from "express";
import { middleware } from "../middlewares/middleware";

const router = express.Router();

// Protected route
router.get("/protected", middleware, (req:Request, res:Response) => {
  res.status(200).json({
    message: "✅ Access granted to protected route",
    user: req.user,
  });
});

export default router;
