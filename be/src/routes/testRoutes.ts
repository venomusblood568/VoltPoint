import express, { Request, Response } from "express";

const router = express.Router();

// Public test route
router.get("/testroutes", (req: Request, res: Response) => {
  res.status(200).json({ message: "testRoute backend is running" });
});

export default router;
