
import mongoose from "mongoose";
import User from "./user";
import dotenv from "dotenv";


dotenv.config()

const uri = process.env.MONGODB_URI;
if(!uri){
    throw new Error(`MONGODB_URI is missing`)
}

mongoose
  .connect(uri)
  .then(() => console.log("Connected to MongoDB"))
  .catch((error) => console.log("MongoDB connection error:", error));

export{User};