const Joi = require("joi");
const AppError = require("./appError");

const middleware = (schema, property) => {
  return (req, res, next) => {
    const { error } = schema.validate(req.body);
    const valid = error == null;

    if (valid) {
      next();
    } else {
      const { details } = error;
      const message = details.map((i) => i.message).join(",");

      return next(new AppError("Invalid request body", 422));
      // res.status(422).json({
      //   status: "error",
      //   message: "Invalid request body",
      //   error: message,
      // });
    }
  };
};
module.exports = middleware;
