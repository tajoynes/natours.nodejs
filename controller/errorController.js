const AppError = require('../utils/appError');

const handleCastErrorDB = (err) => {
  const message = `Invalid ${err.path}: ${err.value}.`;
  return new AppError(message, 400);
};
const handleDuplicateFieldsDB = (err) => {
  const value = err.errmsg.match(/("')(\\?.)*?\1/);
  const message = `Duplicate field value: ${value}. Please use another value!`;

  return new AppError(message, 400);
};
const handleValidationErorrDB = (err) => {
  //loop over the error objects to extract specific values from each object
  const errors = Object.value(err.errors).map((el = el.message));
  const message = `Invalid input data. ${errors.join('. ')}`;
  return new AppError(message, 400);
};

const sendErrorDev = (err, res) => {
  res.status(err.statusCode).json({
    status: err.status,
    error: err,
    message: err.message,
    stack: err.stack,
  });
};
const sendErrorProd = (err, res) => {
  //Trusted operational error, sends message to client
  if (err.isOperational) {
    res.status(err.statusCode).json({
      status: err.status,
      message: err.message,
    });
  } else {
    //PRogramming or other unknown error withold details from client
    //Log error to console then send  generic message to client
    console.log('Error', err);
    res.status(500).json({
      status: 'error',
      message: 'Something went wrong...',
    });
  }
};

//Refactored global error handler
module.exports = (err, req, res, next) => {
  //   console.log(err.stack);

  err.statusCode = err.statusCode || 500;
  err.status = err.statusCode || 'error';

  //Differentiate between development and production enviroment
  //Limiting the amount of information depnding on enviroment
  if (process.env.NODE_ENV === 'development') {
    sendErrorDev(err, res);
  } else if (process.env.NODE_ENV === 'production') {
    let error = { ...err };
    if (error.name === 'CastError') {
      error = handleCastErrorDB(error);
    }
    if (error.code === 11000) {
      error = handleDuplicateFieldsDB(error);
    }
    if (error.name === 'ValidationError') {
      error = handleValidationErorrDB(error);
    }
    sendErrorProd(error, res);
  }
};
