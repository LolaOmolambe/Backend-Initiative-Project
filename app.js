const express = require("express");
const bodyParser = require("body-parser");
const cors = require("cors");

const routes = require("./routes/indexRoutes");
const passport = require("passport");
require("./helpers/passport");

const app = express();

//app.use(express.json());
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));

app.use(passport.initialize());
app.use(passport.session());
app.use(cors());

app.use("/api", routes);

module.exports = app;
