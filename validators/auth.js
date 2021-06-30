const Joi = require("joi");

const authSchemas = {
  userSignUp: Joi.object().keys({
    name: Joi.string().required().min(3).messages({
      "string.min": "Name must contain at least 3 characters !",
      "any.required": "Name is required !",
    }),
    email: Joi.string().required().email().messages({
      "string.email": "Email address is invalid !",
      "any.required": "Email is required !",
    }),
    password: Joi.string().required().min(5).messages({
      "string.min": "Password must contain at least 5 characters !",
      "any.required": "Password is required !",
    }),
    confirmPassword: Joi.string()
      .required()
      .min(5)
      .valid(Joi.ref("password"))
      .messages({
        "string.min": "Password Confirm must contain at least 5 characters !",
        "any.required": "Password Confirm is required !",
        "string.allowOnly": "Password Confirm must match password!",
      }),
  }),
  userLogin: Joi.object().keys({
    email: Joi.string().required().email().messages({
      "string.email": "Email address is invalid !",
      "any.required": "Email is required !",
    }),
    password: Joi.string().required().min(5).messages({
      "string.min": "Password must contain at least 5 characters !",
      "any.required": "Password is required !",
    }),
  }),
  resetPassword: Joi.object().keys({
    password: Joi.string().required().min(5).messages({
      "string.min": "Password must contain at least 5 characters !",
      "any.required": "Password is required !",
    }),
    confirmPassword: Joi.string()
      .required()
      .min(5)
      .valid(Joi.ref("password"))
      .messages({
        "string.min": "Password confirm must contain at least 5 characters !",
        "any.required": "Password confirm is required !",
        "string.allowOnly": "Password Confirm must match password!",
      }),
  }),
};

module.exports = authSchemas;
