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
    movieId: Joi.string().required(),
    email: Joi.string().required(),
    full_name: Joi.string().required(),
    paymentType: Joi.string().required()
  }),
  authSignUpModel: Joi.object().keys({
    name: Joi.string().required(),
    email: Joi.string().required(),
    password: Joi.string().required(),
    confirmPassword: Joi.string().required(),
  })
};
module.exports = schemas;
