const User = require('../models/userModel');
const AppError = require('../utils/AppError');
const catchAsyncErrors = require('../utils/catchAsyncErrors');
const bcrypt = require('bcrypt');

const checkFieldsForUpdate = (bodyKeys, prohibitedFields, next) => {
  bodyKeys.forEach((key) => {
    if (prohibitedFields.includes(key))
      return next(
        new AppError(
          `Field ${key} can not be updated using this resource!`,
          400,
        ),
      );
  });
};

exports.createNewUser = catchAsyncErrors(async (req, res, next) => {
  const { name, password, passwordConfirm, email, passwordChangeDate } =
    req.body;

  if (!password === passwordConfirm)
    return next(
      new AppError(
        'Password and password confirm fields should be the same!',
        400,
      ),
    );

  const newUser = await User.create({
    name,
    password,
    passwordConfirm,
    email,
    passwordChangeDate,
  });

  res.status(201).json({
    status: 'success',
    data: {
      newUser,
    },
  });
});

exports.getUserById = catchAsyncErrors(async (req, res, next) => {
  const user = await User.findById(req.params.id);

  if (!user) return next(new AppError('Can`t find user with this id', 400));

  res.status(200).json({
    status: 'success',
    data: {
      user,
    },
  });
});

exports.updatePassword = catchAsyncErrors(async (req, res, next) => {
  const user = await User.findById(req.user._id).select('+password').exec();

  // * Checking if current password that was sent is correct
  const passwordVerified = await bcrypt.compare(
    req.body.oldPassword,
    user.password,
  );
  if (!passwordVerified)
    return next(new AppError('Your current password is wrong', 401));

  // * Changing password and passwordConfirm
  user.password = req.body.newPassword;
  user.passwordConfirm = req.body.newPasswordConfirm;

  // * Saving a user document TO database
  await user.save();

  res.status(200).json({
    status: 'success',
    data: {
      user,
    },
  });
});

exports.updateData = catchAsyncErrors(async (req, res, next) => {
  const filter = { _id: req.user._id };

  const prohibitedFields = [
    'password',
    'passwordConfirm',
    'role',
    'emailIsConfirmed',
    'photo',
  ];
  checkFieldsForUpdate(Object.keys(req.body), prohibitedFields, next);

  const update = req.body;

  const user = await User.findOneAndUpdate(filter, update, { new: true });

  res.status(200).json({
    status: 'success',
    data: {
      user,
    },
  });
});
