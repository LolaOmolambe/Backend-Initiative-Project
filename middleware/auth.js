const jwt = require("jsonwebtoken");
const User = require("../models/userModel");
const AppError = require("../errors/appError");

exports.protectRoutes = async (req, res, next) => {
    try {
      let token;
  
      if (
        req.headers.authorization &&
        req.headers.authorization.startsWith("Bearer")
      ) {
        token = req.headers.authorization.split(" ")[1];
      }
  
      if (!token) {
        return next(new AppError("You are not authenticated. Please login", 401));
      }
  
      let decodedToken = await jwt.verify(token, process.env.JWT_SECRET);
  
      const user = await User.findById(decodedToken.userId);
  
      if (!user) {
        return next(new AppError("User does not exist", 401));
      }
      req.user = user;
      next();
    } catch (err) {
      next(err);
    }
  };
  
  exports.rolesAllowed = (...roles) => {
    return (req, res, next) => {
      if (!roles.includes(req.user.role)) {
        return next(
          new AppError("You are not authorized to access this route", 403)
        );
      }
      next();
    };
  };