const Joi = require("joi");

const transactionSchemas = {
  fundWallet: Joi.object().keys({
    amount: Joi.number().required().min(100).messages({
      "number.min": "Amount must be at least 100 naira !",
      "any.required": "Amount is required !",
    }),
    email: Joi.string().required().email().messages({
      "string.email": "Email address is invalid !",
      "any.required": "Email is required !",
    }),
    full_name: Joi.string().required().messages({
      "any.required": "Full name is required !",
    }),
  }),
};

module.exports = transactionSchemas;
