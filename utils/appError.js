//Created a class that extends Error class via class inheretince
class AppError extends Error {
  //Constructor method called each time object is created from this class
  constructor(message, statusCode) {
    //Call super in order to call parent constructor
    super(message);

    this.statusCode = statusCode;
    this.status = `${statusCode}`.startsWith('4') ? 'Fail' : 'Error'; //Ternary operater '?'
    this.isOperational = true;
    //Stack Trace shows where the error occured
    Error.captureStackTrace(this, this.constructor);
  }
}

module.exports = AppError;
