const jwt = require('jsonwebtoken');
const { promisify } = require('util');
const User = require('./../models/userModel');
const catchAsync = require('./../utils/catchAsync');
const AppError = require('./../utils/appError');

const signToken = (id) => {
  return jwt.sign({ id }, process.env.JWT_SECRET, {
    expiresIn: process.env.JWT_EXPIRES_IN,
  });
};

exports.signup = catchAsync(async (req, res, next) => {
  const newUser = await User.create({
    name: req.body.name,
    email: req.body.email,
    password: req.body.password,
    passwordConfirm: req.body.passwordConfirm,
  });

  // Sign a JWT to the user ID
  // const token = jwt.sign({ id: newUser._id }, process.env.JWT_SECRET, {
  //   expiresIn: process.env.JWT_EXPIRES_IN,
  // });
  const token = signToken(newUser._id);

  res.status(201).json({
    status: 'success',
    token,
    data: {
      user: newUser,
    },
  });
});

exports.login = catchAsync(async (req, res, next) => {
  const { email, password } = req.body;

  //Check if email and password exist
  //Utilizing return to ensure that after calling next middleware we want finsih the login function immediately
  if (!email || !password) {
    return next(new AppError('Please provide email and password', 400));
  }
  //check if user exist and password is correct
  //Select field from database
  // Use '+' to add field that is not by default no selected
  const user = await User.findOne({ email }).select('+password');
  //After every is validated send JWT to client
  // const correct = await user.correctPassword(password, user.password);

  if (!user || !(await user.correctPassword(password, user.password))) {
    return next(new AppError('Invalid email or password', 401));
  }

  const token = signToken(user._id);

  res.status(200).json({
    status: 'success',
    token,
  });
});

exports.protect = catchAsync(async (req, res, next) => {
  //Retrieve token and check if token exist
  let token;
  if (
    req.headers.authorization &&
    req.headers.authorization.startsWith('Bearer')
  ) {
    token = req.headers.authorization.split(' ')[1];
  }

  // console.log(token);

  if (!token) {
    return next(new AppError('Error, you are not logged in.', 401));
  }

  //Validate 'verify' token for authenticity
  const decoded = await promisify(jwt.verify)(token, process.env.JWT_SECRET);

  //If successful-check if user exist
  const freshUser = await User.findById(decoded.id);

  console.log(currentUser);
  if (!freshUser) {
    return next(new AppError('User with that token no longer exist', 401));
  }

  //Check if user has/had changed password after token was issued
  if (currentUser.changedPasswordAfter(decoded.iat)) {
    return next(
      new AppError('User recently changed password! Please try again', 401)
    );
  }

  //Grant access to protected route
  req.user = currentUser;
  next();
});
