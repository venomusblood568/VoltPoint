import express from "express";
import { signup } from "../controllers/signupuser";
import { signin } from "../controllers/signinuser";

const router = express.Router();

router.post("/signup", signup);
router.post("/signin", signin);
export default router;
