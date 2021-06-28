const express = require("express");
const router = express.Router();
const rentalController = require("../controllers/rentalController");
const joiMiddleware = require("../middleware/joiMiddleware");
const { addBooking } = require("../validators/rental");
const authMiddleware = require("../middleware/auth");

router.use(authMiddleware.protectRoutes);

/**Rent a Movie, Get All Users Bookings */
router
  .route("/")
  .post(joiMiddleware(addBooking), rentalController.createBooking)
  .get(rentalController.getAllUsersBookings);

router
  .route("/:id")
  .get(rentalController.getBooking)
  .put(rentalController.updateBooking)
  .delete(rentalController.deleteBooking);
module.exports = router;
