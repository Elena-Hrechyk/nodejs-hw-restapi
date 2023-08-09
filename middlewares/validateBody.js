const HttpErr = require("../helpers/HttpError");

const validateBody = (schema) => {
  const validateFunc = (req, res, next) => {
    const { error } = schema.validate(req.body);
    if (error) {
      next(HttpErr(400, error.message));
    }
    next();
  };
  return validateFunc;
};

module.exports = validateBody;
