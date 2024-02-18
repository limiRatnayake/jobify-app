import { StatusCodes } from "http-status-codes";
import User from "../models/userModel.js";
import Job from "../models/jobModel.js";
import cloudinary from "cloudinary";
import { promises as fs } from "fs"; //file system module
import { formatImage } from "../middleware/multerMiddleware.js";

export const getCurrentUser = async (req, res) => {
  const user = await User.findOne({ _id: req.user.userId });
  const userWithoutPassword = user.toJSON();
  res.status(StatusCodes.OK).json({ user: userWithoutPassword });
};

export const getApplicationStats = async (req, res) => {
  const users = await User.countDocuments();
  const jobs = await Job.countDocuments();
  res.status(StatusCodes.OK).json({ users, jobs });
};

// this update user with file memory upload
export const updateUser = async (req, res) => {
  const newUser = { ...req.body };
  delete newUser.password;
  if (req.file) {
    const file = formatImage(req.file)
    const response = await cloudinary.v2.uploader.upload(file);
    
    newUser.avatar = response.secure_url;
    newUser.avatarPublicId = response.public_id;
  }
  const updateUser = await User.findByIdAndUpdate(req.user.userId, newUser);
  // check oldUser(updateUser has values before user get updated) has a avatar if so then delete the old avatar frm cloud
  if (req.file && updateUser.avatarPublicId) {
    await cloudinary.v2.uploader.destroy(updateUser.avatarPublicId);
  }
  res.status(StatusCodes.CREATED).json({ msg: `update user` });
};

//This update user with file disk upload
// export const updateUser = async (req, res) => {
//   const newUser = { ...req.body };
//   delete newUser.password;
//   if (req.file) {
//     const response = await cloudinary.v2.uploader.upload(req.file.path);
//     // await fs.unlink(req.file.path); //we wanna remove the public/upload files that added after submitting for cloud - we used in disk storage setup
//     newUser.avatar = response.secure_url;
//     newUser.avatarPublicId = response.public_id;
//   }
//   const updateUser = await User.findByIdAndUpdate(req.user.userId, newUser);
//   // check oldUser(updateUser has values before user get updated) has a avatar if so then delete the old avatar frm cloud
//   if (req.file && updateUser.avatarPublicId) {
//     await cloudinary.v2.uploader.destroy(updateUser.avatarPublicId);
//   }
//   res.status(StatusCodes.CREATED).json({ msg: `update user` });
// };
