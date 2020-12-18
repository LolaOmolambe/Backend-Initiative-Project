const uuid = require("uuid");
const fs = require("fs");
const userData = JSON.parse(fs.readFileSync(`${__dirname}/../data/users.js`));

const moviesData = JSON.parse(
  fs.readFileSync(`${__dirname}/../data/movies.js`)
);

const bookingData = JSON.parse(
  fs.readFileSync(`${__dirname}/../data/bookings.js`)
);

exports.createBooking = (req, res, next) => {
  try {
    let movie = moviesData.find((el) => el.id === req.body.movieId);
    if (!movie) {
      return res.status(404).json({
        message: `Movie with id ${req.body.movieId} does not exist`,
        data: [],
      });
    }
    let user = userData.find((el) => el._id === req.body.userId);
    if (!user) {
      return res.status(404).json({
        message: `User with id ${req.body.userId} does not exist`,
        data: [],
      });
    }
    let newBooking = {
      _id: uuid.v4(),
      userId: user._id,
      movieId: movie.id,
      price: movie.price,
      paid: true,
      returned: false,
      active: true,
    };
    bookingData.push(newBooking);

    fs.writeFileSync(
      `${__dirname}/../data/bookings.js`,
      JSON.stringify(bookingData)
    );
    res.status(201).json({
      status: "Success",
      data: newBooking,
    });
  } catch (err) {
    res.status(500).json({
      message: "Oops, Something went wrong",
    });
  }
};

exports.getAllBookings = (req, res, next) => {
  try {
    let result = bookingData.filter((booking) => booking.active === true);
    res.status(200).json({
      message: "Success",
      data: result,
    });
  } catch (err) {
    res.status(500).json({
      message: "Oops, Something went wrong",
    });
  }
};

exports.getBooking = (req, res, next) => {
  try {
    let booking = bookingData.filter((el) => el._id === req.params.id);
    if (booking.length === 0) {
      return res.status(404).json({
        message: `Booking with id ${req.params.id} does not exist`,
        data: [],
      });
    } else {
      res.status(200).json({
        message: "Success",
        data: booking,
      });
    }
  } catch (err) {
    res.status(500).json({
      message: "Oops, Something went wrong",
    });
  }
};

exports.updateBooking = (req, res, next) => {
  try {
    const bookingExists = bookingData.some((el) => el._id === req.params.id);
    if (bookingExists) {
      //const data = req.body;
      bookingData.forEach((booking) => {
        if (booking._id === req.params.id) {
          booking.returned = true;

          fs.writeFileSync(
            `${__dirname}/../data/bookings.js`,
            JSON.stringify(bookingData)
          );
          return res.status(200).json({
            status: "Success",
            data: booking,
          });
        }
      });
    }
  } catch (err) {
    res.status(500).json({
      message: "Oops, Something went wrong",
    });
  }
};

exports.deleteBooking = (req, res, next) => {
  try {
    let booking = bookingData.find((booking) => booking._id === req.params.id);
    if (booking) {
      bookingData.forEach((el) => {
        if (el._id === req.params.id) {
          el.active = false;
        }
        fs.writeFileSync(
          `${__dirname}/../data/bookings.js`,
          JSON.stringify(bookingData)
        );
      });
      return res.status(200).json({
        message: "Success",
        data: null,
      });
    } else {
      res.status(404).json({
        message: `Booking with id ${req.params.id} does not exist`,
        data: [],
      });
    }
  } catch (err) {}
};
