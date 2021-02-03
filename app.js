const express = require("express");

const routes = require("./routes/indexRoutes");
const passport = require('passport');
require('./helpers/passport');

const app = express();

app.use(express.json());

app.use(passport.initialize());
app.use(passport.session()); 

app.use("/api", routes);

module.exports = app;
