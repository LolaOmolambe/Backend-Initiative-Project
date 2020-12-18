const express = require("express");
const router = express.Router();
const rentalController = require("../controllers/rentalController");


router.route("/").post(rentalController.createBooking).get(rentalController.getAllBookings);

router.route("/:id").get(rentalController.getBooking).put(rentalController.updateBooking).delete(rentalController.deleteBooking);
module.exports = router;