const Joi = require("joi");

const movieSchemas = {
  addMovie: Joi.object().keys({
    title: Joi.string().required().min(3).messages({
      "string.min": "Title must contain at least 3 characters !",
      "any.required": "Title is required !",
    }),
    price: Joi.number().required().min(100).messages({
      "number.min": "Price must be at least 100 naira !",
      "any.required": "Price is required !",
    }),
    genre: Joi.string().required().valid("Action", "Comedy", "Drama", "Fantasy", "Horror", "Mystery", "Romance", "Thriller").messages({
      "any.required": "Genre is required !",
      "string.valid": "Context must be one of ['Action', 'Comedy', 'Drama', 'Fantasy', 'Horror', 'Mystery', 'Romance','Thriller'] !",
    }),
    poster: Joi.any(),
  }),
};

module.exports = movieSchemas;
