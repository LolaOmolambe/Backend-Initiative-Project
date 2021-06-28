const express = require("express");
const router = express.Router();
const rentalController = require("../controllers/rentalController");
//const schemas = require("../validators/schemas");
const joiMiddleware = require("../middleware/joiMiddleware");
const { bookingModel } = require("../validators/schemas");

//const middleware = require("../middleware/joiMiddleware");
const authController = require("../controllers/authController");
const authMiddleware = require("../middleware/auth");

router.use(authMiddleware.protectRoutes);

router
  .route("/")
  .post(joiMiddleware(bookingModel), rentalController.createBooking)
  .get(rentalController.getAllUsersBookings);

router
  .route("/:id")
  .get(rentalController.getBooking)
  .put(rentalController.updateBooking)
  .delete(rentalController.deleteBooking);
module.exports = router;
