import mongoose from "mongoose";
import { JOB_STATUS, JOB_TYPE } from "../utils/constants.js";

const userSchema = new mongoose.Schema(
  {
    name: String,
    email: String,
    password: String,
    lastName: {
      type: String,
      default: "lastName",
    },
    location: {
      type: String,
      default: "my city",
    },
    role: {
      type: String,
      enum: ["user", "admin"],
      default: "user",
    },
    avatar: String,
    avatarPublicId: String
  },
  { timestamps: true }
);

// create this to remove the pass property from the userModal
userSchema.methods.toJSON = function () {
  let obj = this.toObject();
  delete obj.password;
  return obj;
};

let users
try {
  users = mongoose.model('users')
} catch (error) {
  users = mongoose.model("users", userSchema);
}


export default users;
