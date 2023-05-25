// VIDEO 118 ERRORS DURING DEVELOPEMENT VS PRODUCTION
const AppError = require("../utils/appError");

const handleCastErrorDB = (err) => {
  const message = `Invalid ${err.path} : ${err.value}.`;
  return new AppError(message, 400);
};

const handleDuplicateFieldsDB = (err) => {
  // extract the duplicate name entered by the user from the err.errmsg.
  const name = err.keyValue.name;
  const message = `Duplicate field value : ${name} , Please use another value`;
  return new AppError(message, 400);
};

const handleValidationErrorDB = (err) => {
  const errors = Object.values(err.errors).map((el) => el.message);
  const message = `Invalid Input Data. ${errors.join(", ")}`;
  return new AppError(message, 400);
};

module.exports = (err, req, res, next) => {
  //   console.log(err.stack);
  // read status code from error object

  err.statusCode = err.statusCode || 500;
  err.status = err.status || "error";

  if (process.env.NODE_ENV === "developement") {
    let error = { ...err };

    // Invalid ID
    if (error.name === "CastError") {
      error = handleCastErrorDB(error);
    }

    // Duplicate Value
    if (error.code === 11000) {
      error = handleDuplicateFieldsDB(error);
    }

    // Validation Errors
    if (error._message === "Validation failed") {
      error = handleValidationErrorDB(error);
    }

    res.status(error.statusCode).json({
      status: error.status,
      error: error,
      message: error.message,
      stack: err.stack,
      // message1: err.message,
    });

    /*
  
  */
  } else if (process.env.NODE_ENV === "production") {
    if (err.isOperational) {
      res.status(err.statusCode).json({
        status: err.status,
        message: err.message,
      });
      // Production Error
      let error = { ...err };

      if (error.name === "CastError") {
        error = handleCastErrorDB(error);
      }

      if (error.code === 11000) {
        error = handleDuplicateFieldsDB(error);
      }

      res.status(500).json({
        status: error.status,
        message: error.message,
      });
    }
  }
};
