const { validationResult } = require('express-validator');
const { sendError } = require('../utils/responseHandler');

const validate = (req, res, next) => {
  const errors = validationResult(req);
  
  if (!errors.isEmpty()) {
    const errorMessages = errors.array().map(error => ({
      field: error.path || error.param,
      message: error.msg
    }));
    
    return sendError(res, 400, 'Validation failed', errorMessages);
  }
  
  next();
};

module.exports = validate;
