import express, { Request, Response } from "express";

const router = express.Router();

router.get("/testroutes", (req: Request, res: Response) => {
  res.send("testRoute backend is running");
});

export default router;
