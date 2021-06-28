const Joi = require("joi");

const rentalSchemas = {
  addBooking: Joi.object().keys({
    movieId: Joi.string().required().messages({
      "any.required": "Movie Id is required !",
    }),
    email: Joi.string()
      .email()
      .when("paymentType", {
        is: "Paystack",
        then: Joi.string().required().email().messages({
          "string.email": "Email address is invalid !",
          "any.required": "Email is required !",
        }),
      }),
    full_name: Joi.string().when("paymentType", {
      is: "Paystack",
      then: Joi.string()
        .required()
        .messages({ "any.required": "Full name is required !" }),
    }),
    paymentType: Joi.string().required().valid("Wallet", "Paystack").messages({
      "any.required": "Payment Type is required !",
      "string.valid": "Payment Type must be one of ['Wallet', 'Paystack'] !",
    }),
  }),
};

module.exports = rentalSchemas;
