import express, { Request, Response } from "express";

const router = express.Router();

router.get("/testroutes", (req: Request, res: Response) => {
  res.json(200).json("testRoute backend is running");
});

export default router;
