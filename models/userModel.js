const mongoose = require('mongoose');
const validator = require('validator');
const bcrypt = require('bcryptjs');
const crypto = require('crypto');

const userSchema = new mongoose.Schema({
  email: {
    type: String,
    required: [true, 'The email is required'],
    unique: true,
    validator: [validator.isEmail, 'Please provide a valid email'],
  },
  name: {
    type: String,
    required: [true, 'The name is required'],
    minlength: [3, 'Name must contains at least 3 letters'],
  },
  password: {
    type: String,
    required: [true, 'The password is required'],
    minlength: 8,
    select: false,
  },
  passwordConfirm: {
    type: String,
    required: [true, 'Please confirm your password'],
    validate: {
      validator: function (el) {
        return el === this.password;
      },
      message: 'Passwords are not the same!',
    },
  },
  role: {
    type: String,
    enum: ['user', 'admin'],
    default: 'user',
  },
  passwordChangedAt: Date,
  passwordResetToken: String,
  passwordResetExpires: Date,
  active: {
    type: Boolean,
    default: true,
    select: false,
  },
});

userSchema.pre('save', async function (next) {
  if (!this.isModified('password')) return next();

  this.password = await bcrypt.hash(this.password, 12);

  this.passwordConfirm = undefined;
  next();
});

userSchema.pre('save', function (next) {
  if (!this.isModified('password') || this.isNew) return next();

  this.passwordChangedAt = Date.now() - 1000;
  next();
});

userSchema.methods.correctPassword = async function (
  candidatePassword,
  password
) {
  return await bcrypt.compare(candidatePassword, password);
};

userSchema.methods.createResetPasswordToken = function () {
  const token = crypto.randomBytes(32).toString('hex');

  this.passwordResetToken = crypto
    .createHash('sha256')
    .update(token)
    .digest('hex');

  this.passwordResetExpires = Date.now() + 10 * 60 * 1000;

  return token;
};

userSchema.methods.changedPasswordAfter = function (time) {
  if (this.passwordChangedAt) {
    const changedTimestamp = parseInt(
      this.passwordChangedAt.getTime() / 1000,
      10
    );

    return time < changedTimestamp;
  }

  return false;
};

const User = mongoose.model('User', userSchema);

module.exports = User;
