const express = require("express");
const bodyParser = require("body-parser");
const cors = require("cors");
const morgan = require("morgan");
const routes = require("./routes/indexRoutes");
const errorHandler = require("./controllers/errorHandler");
const passport = require("passport");
require("./helpers/passport");

const app = express();

// Development logging
if (process.env.NODE_ENV === 'development') {
    app.use(morgan('dev'));
}

//app.use(express.json());
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));

app.use(passport.initialize());
app.use(passport.session());
app.use(cors());

app.use("/api", routes);

app.use(errorHandler);

module.exports = app;
