const express = require("express");
const bodyParser = require("body-parser");
const cors = require("cors");
const morgan = require("morgan");
const routes = require("./routes/indexRoutes");
const errorHandler = require("./errors/errorHandler");
const AppError = require("./errors/appError");
const passport = require("passport");
require("./utils/passport");

const app = express();

// Development logging
if (process.env.NODE_ENV === "development") {
  app.use(morgan("dev"));
}

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.use(passport.initialize());
app.use(passport.session());
app.use(cors());

app.use("/api", routes);

app.all("*", (req, res, next) => {
  next(
    new AppError(
      `This endpoint ${req.originalUrl} does not exist on this server!`,
      404
    )
  );
});

app.use(errorHandler);

module.exports = app;
