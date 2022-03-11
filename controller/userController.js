const User = require('./../models/userModel');
const catchAsync = require('./../utils/catchAsync');

exports.getUsers = catchAsync(async (req, res, next) => {
  const users = await User.find();

  //Send Response
  res.status(200).json({
    status: 'success',
    results: users.length,
    data: { users },
  });
});

exports.createUser = (req, res) => {
  res.status(500).json({
    status: 'error',
    message: 'Route not yet implemented!',
  });
};
exports.getUser = (req, res) => {
  res.status(500).json({
    status: 'error',
    message: 'Route not yet implemented!',
  });
};
exports.updateUser = (req, res) => {
  res.status(500).json({
    status: 'error',
    message: 'Route not yet implemented!',
  });
};
exports.deleteUser = (req, res) => {
  res.status(500).json({
    status: 'error',
    message: 'Route not yet implemented!',
  });
};
