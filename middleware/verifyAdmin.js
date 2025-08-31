import createError from "../utils/createError.js";

export const verifyAdmin = (req, res, next) => {
  if (req.role === "admin") {
    next();
  } else {
    return next(createError(403, "You are not authorized"));
  }
};
