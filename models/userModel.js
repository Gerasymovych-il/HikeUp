const mongoose = require('mongoose');
const bcrypt = require('bcrypt');
const { createHash, randomBytes } = require('node:crypto');

const { Schema } = mongoose;

const userSchema = new Schema({
  name: {
    type: String,
    required: [true, 'Name is a required field.'],
    minLength: [3, 'Name should be minimum 3 characters long'],
    maxLength: [20, 'Name should be maximum 20 characters long'],
  },
  password: {
    type: String,
    required: [true, 'Password is a required field.'],
    minLength: [8, 'Password should be minimum 8 characters long'],
    maxLength: [16, 'Password should be maximum 16 characters long'],
    validate: {
      validator: function (pass) {
        return /^(?=.*[A-Za-z])(?=.*\d)[A-Za-z\d]{8,}$/.test(pass);
      },
      message:
        'Password should contain minimum eight characters, at least one letter and one number',
    },
    select: false,
  },
  passwordConfirm: {
    type: String,
    required: [true, 'PasswordConfirm is a required field.'],
    minLength: [8, 'PasswordConfirm should be minimum 8 characters long'],
    maxLength: [16, 'PasswordConfirm should be maximum 16 characters long'],
    validate: {
      validator: function (pass) {
        return (
          /^(?=.*[A-Za-z])(?=.*\d)[A-Za-z\d]{8,}$/.test(pass) &&
          pass === this.password
        );
      },
      message:
        'PasswordConfirm should contain minimum eight characters, at least one letter and one number',
    },
  },
  role: {
    type: String,
    enum: ['user', 'company', 'admin'],
    default: 'user',
  },
  email: {
    type: String,
    required: true,
    validate: {
      validator: function (email) {
        return /^([a-zA-Z0-9._%-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,})$/.test(email);
      },
      message:
        'PasswordConfirm should contain minimum eight characters, at least one letter and one number',
    },
    unique: [true, 'User with this email already exists'],
  },
  // TODO: implement email confirmation process
  emailIsConfirmed: {
    type: Boolean,
    default: false,
  },
  // Todo: implement this!
  // favoritePlans: {
  //   type: [Plan],
  // },
  // favoriteReviews: {
  //   type: [Review],
  // },
  photo: {
    type: String,
    default: '/img/avatar-default.png',
  },
  passwordChangeDate: Date,
  passwordResetToken: String,
  passwordResetTokenExpires: Date,
  accountActiveStatus: {
    type: Boolean,
    default: true,
    select: false,
  },
});

// * Encrypting the password with bcrypt
userSchema.pre('save', async function (next) {
  // Check-out if the password was modified, if not - calling next function
  if (!this.isModified('password')) return next();
  // Password encryption and saving encripted version to database. Second argument - cost factor
  this.password = await bcrypt.hash(this.password, 12);
  // Removing passwordConfirm field
  this.passwordConfirm = undefined;
  //Changing passwordChangeDate if document isn`t new
  if (!this.isNew) this.passwordChangeDate = Date.now();

  next();
});

// * Query middleware that filters out all inactive users
userSchema.pre(/^find/, function (next) {
  this.find({ accountActiveStatus: true });
  next();
});

userSchema.methods.checkIfPasswordWasChanged = function (requestTimestamp) {
  if (this.passwordChangeDate) {
    const passwordChangeTimestamp = this.passwordChangeDate.getTime() / 1000;
    if (passwordChangeTimestamp > requestTimestamp) return true;
  }

  return false;
};

userSchema.methods.createPasswordResetToken = function () {
  // * Creating random reset token
  const resetToken = randomBytes(32).toString('hex');
  // * Encrypting token to save it to database
  const encryptedPasswordResetToken = createHash('sha256')
    .update(resetToken)
    .digest('hex');
  // * Creating expiration date to the token
  const passwordExpiresOn = Date.now() + 1000 * 60 * 10;
  // * Saving token and expiration data to database;
  this.passwordResetToken = encryptedPasswordResetToken;
  this.passwordResetTokenExpires = passwordExpiresOn;

  // * Returning not encrypted version of a token
  return resetToken;
};

module.exports = mongoose.model('User', userSchema);
