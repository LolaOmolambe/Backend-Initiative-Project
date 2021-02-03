const express = require("express");
const router = express.Router();
const rentalController = require("../controllers/rentalController");
const schemas = require("../helpers/schemas");
const middleware = require("../helpers/middleware");
const authController = require("../controllers/authController");

router
  .route("/")
  .post(middleware(schemas.bookingModel),authController.protectRoutes, rentalController.createBooking)
  .get(authController.protectRoutes, rentalController.getAllUsersBookings);

router
  .route("/:id")
  .get(authController.protectRoutes, rentalController.getBooking)
  .put(authController.protectRoutes, rentalController.updateBooking)
  .delete(authController.protectRoutes, rentalController.deleteBooking);
module.exports = router;
