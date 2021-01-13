const express = require("express");
const router = express.Router();
const rentalController = require("../controllers/rentalController");
const schemas = require("../helpers/schemas");
const middleware = require("../helpers/middleware");

router
  .route("/")
  .post(middleware(schemas.bookingModel),rentalController.createBooking)
  .get(rentalController.getAllBookings);

router
  .route("/:id")
  .get(rentalController.getBooking)
  .put(rentalController.updateBooking)
  .delete(rentalController.deleteBooking);
module.exports = router;
