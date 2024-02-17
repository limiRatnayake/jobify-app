import { body, param, validationResult } from "express-validator";
import {
  BadRequestError,
  NotFoundError,
  UnauthorizedError,
} from "../errors/customErrors.js";
import { JOB_STATUS, JOB_TYPE } from "../utils/constants.js";
import mongoose from "mongoose";
import Job from "../models/jobModel.js";
import User from "../models/userModel.js";

const withValidationError = (validateValues) => {
  return [
    validateValues,
    (req, res, next) => {
      const errors = validationResult(req);
      if (!errors.isEmpty()) {
        const errorMessage = errors.array().map((res) => res.msg);
        if (errorMessage[0].startsWith("no job")) {
          throw new NotFoundError(errorMessage);
        }
        if (errorMessage[0].startsWith("not authorized")) {
          throw new UnauthorizedError("not authorized to access this route");
        }
        throw new BadRequestError(errorMessage);
      }
      // we use next to pass down to the next method- it is required
      next();
    },
  ];
};

// validate User
export const validateRegisterInput = withValidationError([
  body("name").notEmpty().withMessage("name is required!"),
  body("email")
    .notEmpty()
    .withMessage("email is required!")
    .isEmail()
    .withMessage("invalid email format")
    .custom(async (email) => {
      const user = await User.findOne({ email });
      if (user) {
        throw new BadRequestError("Email already exist");
      }
    }),
  body("password")
    .notEmpty()
    .withMessage("password is required!")
    .isLength({ min: 8 })
    .withMessage("password must be at least 8 characters long"),
  body("location").notEmpty().withMessage("location is required"),
  body("lastName").notEmpty().withMessage("last name is required"),
]);

export const validateUserInput = withValidationError([
  body("email")
    .notEmpty()
    .withMessage("email is required!")
    .isEmail()
    .withMessage("invalid email format"),
  body("password").notEmpty().withMessage("password is required!"),
]);

export const validateJobInput = withValidationError([
  body("company").notEmpty().withMessage("company is required!"),
  body("position").notEmpty().withMessage("position is required!"),
  body("jobLocation").notEmpty().withMessage("job location is required!"),
  body("jobStatus")
    .isIn(Object.values(JOB_STATUS))
    .withMessage("invalid status value!"),
  body("jobType")
    .isIn(Object.values(JOB_TYPE))
    .withMessage("invalid type value!"),
]);

// check if mangoDB id string value length is equal(400) & id is exist in the DB(404)
export const validateIdParam = withValidationError([
  param("id").custom(async (value, { req }) => {
    const isValid = mongoose.Types.ObjectId.isValid(value);
    if (!isValid) throw new BadRequestError("Invalid MONGO DB id");
    const job = await Job.findById(value);

    if (!job) throw new NotFoundError(`no job with id ${value}`);
    // Give access to data for specific user
    const isAdmin = req.user.role === "admin";
    const isOwner = req.user.userId === job.createdBy.toString();
    if (!isAdmin && !isOwner) {
      throw new UnauthorizedError("not authorized to access this route");
    }
  }),
]);

export const validateUpdateUserInput = withValidationError([
  body("name").notEmpty().withMessage("name is required!"),
  body("email")
    .notEmpty()
    .withMessage("email is required!")
    .isEmail()
    .withMessage("invalid email format")
    .custom(async (email, {req}) => {
      const user = await User.findOne({ email });
      // check user exist and user is not us(we can't update someone else data)
      if (user && user._id.toString() !== req.user.userId) {
        throw new BadRequestError("Email already exist");
      }
    }),
  body("location").notEmpty().withMessage("location is required"),
  body("lastName").notEmpty().withMessage("last name is required"),
]);

// example
// export const validateTest = withValidationError([
//   body("name")
//     .notEmpty()
//     .withMessage("Name is required!")
//     .isLength({ min: 3, max: 30 })
//     .withMessage("Name must be in 3 and 30 characters long")
//     .trim(),
// ]);
