const InvariantError = require("../../exceptions/InvariantError");
const {
  PostJobPayloadSchema,
  PutListStatusJobPayloadSchema,
} = require("./schema");

const ListJobsValidator = {
  validatePostJobPayload: (payload) => {
    const validationResult = PostJobPayloadSchema.validate(payload);

    if (validationResult.error) {
      throw new InvariantError(validationResult.error.message);
    }
  },
  validatePutStatusJobPayload: (payload) => {
    const validationResult = PutListStatusJobPayloadSchema.validate(payload);

    if (validationResult.error) {
      throw new InvariantError(validationResult.error.message);
    }
  },
};

module.exports = ListJobsValidator;
