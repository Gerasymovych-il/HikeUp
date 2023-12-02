const AppError = require('../utils/AppError');
const handleNonOperationalErrors = (err) => {
  let message;

  switch (err.name) {
    case 'CastError':
      message = `${err.name}! Invalid ${err.path}: ${err.value}`;
      return new AppError(message, 400);
    case 'ValidationError':
      message = `${err.name}! ${err}`;
      return new AppError(message, 400);
    default:
      return err;
  }
};

module.exports = (err, req, res, next) => {
  let error;
  if (!err.isOperational) {
    error = handleNonOperationalErrors(err);

    if (!error.isOperational) {
      res.status(500).json({
        status: 'error',
        message: 'Something went wrong! Try again later',
      });
    }
  } else {
    error = err;
  }

  error.statusCode = error.statusCode || 500;
  error.status = error.status || 'Error';

  res.status(error.statusCode).json({
    status: error.status,
    message: error.message,
  });
};
