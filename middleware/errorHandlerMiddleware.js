import { StatusCodes } from "http-status-codes";

const errorHandlerController = (err, req, res, next) => {
  console.log(err, "error");
  const statusCode = err.statusCode || StatusCodes.INTERNAL_SERVER_ERROR;
  const errorMessage = err.message || 'Something went wrong!';
  res.status(statusCode).json({ msg: errorMessage });
};

export default errorHandlerController