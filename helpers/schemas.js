// schemas.js
const Joi = require("joi");
const schemas = {
  userModel: Joi.object().keys({
    name: Joi.string().required(),
    email: Joi.string().required(),
  }),
  movieModel: Joi.object().keys({
    title: Joi.string().required(),
    genre: Joi.string().required(),
    price: Joi.number().min(100).required(),
  }),
  bookingModel: Joi.object().keys({
    userId: Joi.string().required(),
    movieId: Joi.string().required(),
  }),
};
module.exports = schemas;
