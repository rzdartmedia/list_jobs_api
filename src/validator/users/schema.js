const Joi = require("joi");

const PostUserPayloadSchema = Joi.object({
  lcd: Joi.string().required(),
  username: Joi.string().required(),
  password: Joi.string().required(),
  roleUser: Joi.string().required(),
});

const PutPasswordUserPayloadSchema = Joi.object({
  passwordOld: Joi.string().required(),
  passwordNew: Joi.string().min(8).required(),
});

module.exports = { PostUserPayloadSchema, PutPasswordUserPayloadSchema };
