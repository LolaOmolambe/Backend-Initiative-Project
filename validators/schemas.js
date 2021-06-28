// schemas.js
const Joi = require("joi");
const schemas = {
  bookingModel: Joi.object().keys({
    movieId: Joi.string().required(),
    email: Joi.string().required(),
    full_name: Joi.string().required(),
    paymentType: Joi.string().required()
  }),
};
module.exports = schemas;
