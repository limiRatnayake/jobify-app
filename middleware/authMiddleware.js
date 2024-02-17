import {
  BadRequestError,
  UnauthenticatedError,
  UnauthorizedError,
} from "../errors/customErrors.js";
import { verifyJWT } from "../utils/tokenUtils.js";

export const authenticateUser = (req, res, next) => {
  // we need to access our own cookie(by name we gave when we generate cookie)
  const { token } = req.cookies;
  console.log(req.cookies, "token");
  if (!token) {
    throw new UnauthenticatedError("authentication invalid");
  }
  //when token is exist verify the JWT token and get the userID and role that we pass when creating JWT(authController)
  try {
    const { userId, role } = verifyJWT(token);
    const testUser = userId === "65bf2e59b188942ca3aa5a06";
    req.user = { userId, role, testUser };
    next();
  } catch (error) {
    throw new UnauthenticatedError("authentication invalid");
  }
};

export const authorizedPermissions = (...roles) => {
  // roles => gathering all the parameters

  return (req, res, next) => {
    console.log(roles);
    if (!roles.includes(req.user.role)) {
      throw new UnauthorizedError("unauthorized to access the route");
    }
    next();
  };
};

export const checkForTestUser = (req, res, next) => {
  if (req.user.testUser) throw new BadRequestError("Demo user. read only!");
  next();
};
