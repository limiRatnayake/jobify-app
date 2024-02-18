import "express-async-errors";
import express from "express";
import morgan from "morgan";
//to access the env file we use dotenv lib
import * as dotenv from "dotenv";
import mongoose from "mongoose";
import { body, validationResult } from "express-validator";
import cookieParser from "cookie-parser";
import cloudinary from "cloudinary";
import helmet from "helmet";
import mongoSanitize from "express-mongo-sanitize";

dotenv.config();
const app = express();

// custom imports
import jobRouter from "./routes/jobRouter.js";
import authRouter from "./routes/authRouter.js";
import userRouter from "./routes/userRouter.js";

// middlewares
import errorHandlerController from "./middleware/errorHandlerMiddleware.js";
import { authenticateUser } from "./middleware/authMiddleware.js";

// public - public images to utils the uploads - public folder is where we temporarily store them when upload by user
import path, { dirname } from "path";
import { fileURLToPath } from "url";

cloudinary.config({
  cloud_name: process.env.CLOUD_NAME,
  api_key: process.env.CLOUD_API_KEY,
  api_secret: process.env.CLOUD_API_SECRET,
});

const _dirname = dirname(fileURLToPath(import.meta.url));

if (process.env.NODE_ENV === "development") {
  //morgan is use send info about our req
  app.use(morgan("dev"));
}


app.use(cookieParser());
app.use(express.json());
app.use(express.static(path.resolve(_dirname, "./client/dist")));

app.use(helmet());
app.use(mongoSanitize());
// just test routes
// app.get("/", (req, res) => {
//   res.send("Hello world");
// });

// without using a middleware
// app.post(
//   "/api/v1/test",
//   [
//     body("name")
//       .notEmpty()
//       .withMessage("Name is required!")
//       .isLength({min: 15})
//       .withMessage("Name should be at least 15"),
//   ],
//   (req, res, next) => {
//     const errors = validationResult(req);
//     if (!errors.isEmpty()) {
//       const errorMessage = errors.array().map((res) => res.msg);
//       return res.status(400).json({ errors: errorMessage });
//     }
//     // we use next to pass down to the next method- it is required
//     next();
//   },
//   (req, res) => {
//     const { name } = req.body;
//     res.json({ message: `hello ${name}` });
//   }
// );

// app.get("/api/v1/test", (req, res) => {
//   res.json({ msg: "test route" });
// });

// call the routes
app.use("/api/v1/jobs", authenticateUser, jobRouter);
app.use("/api/v1/users", authenticateUser, userRouter);
app.use("/api/v1/auth", authRouter);

// publicly available the client folder
app.get("*", (req, res) => {
  res.sendFile(path.resolve(_dirname, "./client/dist", "index.html"));
});

// resource not found middleware
app.use("*", (req, res) => {
  res.status(404).json({ msg: "not found" });
});

// error middleware - going to trigger in existing route
app.use(errorHandlerController);

const port = process.env.PORT || 5100;

try {
  await mongoose.connect(process.env.MONGO_URL);
  app.listen(port, () => {
    console.log(`server is running on PORT ${port}`);
  });
} catch (error) {
  console.log(error);
  process.exit(1);
}
