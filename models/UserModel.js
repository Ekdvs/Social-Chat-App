import mongoose from "mongoose";

const userSchema = new mongoose.Schema(
  {
    username: {
      type: String,
      required: true,
      unique: true,
      trim: true,
    },
    password: {
      type: String, // store hashed password with bcrypt
      required: true,
      trim: true,
    },
    email: {
      type: String,
      required: true,
      trim: true,
      unique: true,
    },
    bio: {
      type: String,
      default: "",
    },
    avatar: {
      type: String, // cloudinary URL
    },
    role: {
      type: String,
      default: "USER",
      enum: ["USER", "ADMIN"],
    },

    followers: [{ type: mongoose.Schema.Types.ObjectId, ref: "User" }],
    following: [{ type: mongoose.Schema.Types.ObjectId, ref: "User" }],

    isVerified: { type: Boolean, default: false }, // email verified?
  },
  { timestamps: true }
);

export default mongoose.model("User", userSchema);
