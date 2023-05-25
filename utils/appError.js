// Just have a look at Global Error class
class AppError extends Error {
  constructor(message, statusCode) {
    // Message property is consumed from the actual Error Class so, our custom message is passed to that
    super(message);

    this.statusCode = statusCode;
    this.status = `${statusCode}`.startsWith("4") ? "fail" : "error";
    this.isOperational = true;
    Error.captureStackTrace(this, this.constructor);
  }
}

module.exports = AppError;
