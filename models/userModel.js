const mongoose = require('mongoose');
const validator = require('validator');
const bcrypt = require('bcryptjs');

const userSchema = new mongoose.Schema({
  name: {
    type: String,
    required: [true, 'Please enter your name'],
  },
  email: {
    type: String,
    required: [true, 'Please provide a email'],
    unique: true,
    lowercase: true,
    validate: [validator.isEmail, 'Please provide a valid email'],
  },
  photo: String,
  password: {
    type: String,
    required: [true, 'Please provide a password'],
    minlength: 8,
    select: false,
  },
  passwordConfirm: {
    type: String,
    required: [true, 'Please confrim your password'],
    validate: {
      //This only works on CREATE and SAVE
      validator: function (el) {
        return el === this.password; //validating that passwordConfirm and matches password cannot be a arrow function because it needs the THIS keyword
      },
      message: 'Passwords are not the same, try again',
    },
  },
  passwordChangedAt: {
    type: Date,
  },
});

//
userSchema.pre('save', async function (next) {
  //Only run this function if password was actually modified in the document
  if (!this.isModified('password')) {
    return next();
  }
  //Hash the password with cost of 12
  this.password = await bcrypt.hash(this.password, 12);

  //Delete the passwordConfirm field
  this.passwordConfirm = undefined;
  next();
});

//Instance method that is going to be available on all documents on a cetain collection
userSchema.methods.correctPassword = async function (
  candidatePassword,
  userPassword
) {
  return await bcrypt.compare(candidatePassword, userPassword);
};

userSchema.methods.changedPasswordAfter = function (JWTTimestamp) {
  if (this.passwordChangedAt) {
    const changedTimestamp = parseInt(
      this.passwordChangedAt.getTime() / 1000,
      10
    );

    console.log(changedTimestamp, JWTTimestamp);
    return JWTTimestamp < changedTimestamp; //
  }
  //False password is not changed
  return false;
};

const User = mongoose.model('User', userSchema);

module.exports = User;

//Simple userschema that sets parameters for users signing up/logging into the web app
