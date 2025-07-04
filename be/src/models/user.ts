import mongoose from "mongoose";

const UserSchema = new mongoose.Schema({
  firstname: String,
  lastname: String,
  username: { type: String, unique: true },
  password: { type: String, select: true },
});

const User = mongoose.model("User",UserSchema);
export default User;