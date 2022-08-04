//Joi schema for payload validation of apis

const Joi = require("@hapi/joi");

const authSchema = Joi.object({
  name: Joi.string().lowercase().required(),
  tech: Joi.string().lowercase().required(),
  sub: Joi.string().lowercase().required(),
  password: Joi.string().min(2).required(),
});

module.exports = {
  authSchema,
};
