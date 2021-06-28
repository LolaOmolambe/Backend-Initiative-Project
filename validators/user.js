const Joi = require("joi");

const userSchemas = {
  updateUser: Joi.object().keys({
    name: Joi.string().min(3).messages({
      "string.min": "Name must contain at least 3 characters !",
    }),

    picture: Joi.any(),
  }),
};

module.exports = userSchemas;
