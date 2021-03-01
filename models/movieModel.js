const mongoose = require("mongoose");

const movieSchema = new mongoose.Schema(
  {
    title: {
      type: String,
      required: true,
    },
    genre: {
      type: String,
      enum: ["Action", "Comedy", "Drama", "Fantasy", "Horror", "Mystery", "Romance", "Thriller"],
      required: true,
    },
    price: {
      type: Number,
      required: true,
      min: 100
    },
    imageUrl: {
      type: String,
      required: true
    },
    isDeleted: {
      type: Boolean,
      default: false,
    },
  },
  { timestamps: true }
);

movieSchema.pre(/^find/, function (next) {
  this.find({ isDeleted: { $ne: true } });
  next();
});

const movie = mongoose.model("Movie", movieSchema);
module.exports = movie;
