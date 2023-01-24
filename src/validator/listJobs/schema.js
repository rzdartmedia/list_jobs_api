const Joi = require("joi");

const PostJobPayloadSchema = Joi.object({
  job: Joi.string().required(),
  deadline: Joi.date().raw().required(),
  owner: Joi.string().required(),
  levelPriority: Joi.number().max(2).required(),
});

const PutListStatusJobPayloadSchema = Joi.object({
  status: Joi.string().required(),
  description: Joi.string().required(),
  levelPriority: Joi.number().max(2).required(),
  date: Joi.date().raw().required(),
});

module.exports = { PostJobPayloadSchema, PutListStatusJobPayloadSchema };
