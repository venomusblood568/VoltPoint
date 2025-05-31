import express, { Response, Request } from "express";
import { User } from "../models";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import dotenv from "dotenv";

dotenv.config();
const router = express.Router();
const JWT_SECRET = process.env.JWT_SECRET;

export const signin =  
  async (req: Request, res: Response): Promise<void> => {
    const { firstname, lastname, username, password } = req.body;

    try {
      const existing = await User.findOne({ username });
      if (existing) {
        res.status(400).json({ message: "Username already exits" });
        return;
      }

      const hashedpassword = await bcrypt.hash(password, 10);
      const newUser = await User.create({
        firstname,
        lastname,
        username,
        password: hashedpassword,
      });
      const token = jwt.sign({ id: newUser._id }, JWT_SECRET as string);

      res
        .status(201)
        .json({ messgae: "User created", token: token, user: newUser });
    } catch (error) {
      res.status(500).json({ message: "Internal Error", error: error });
    }
  }
