const User = require('../models/userModel');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const { promisify } = require('util');
const { sendMyTextMail } = require('../utils/emails');
const { createHash } = require('node:crypto');
const AppError = require('../utils/AppError');
const catchAsyncErrors = require('../utils/catchAsyncErrors');

const signToken = async (userId) => {
  try {
    return await jwt.sign({ userId }, process.env.JWT_SECRET, {
      expiresIn: '4h',
    });
  } catch (e) {
    console.log(e);
  }
};
exports.protect = catchAsyncErrors(async (req, res, next) => {
  // Retrieving token from authorization header;
  const token = req.headers.authorization;
  // Authorization header check. If doesnt exist - returning error;
  if (!token)
    return next(
      new AppError(
        'Only logged in users have an access to this section. Please log in or sign up',
      ),
      401,
    );
  // Verifying JWT token and retrieving decoded data (id and timestamps) from JWT
  const decoded = await promisify(jwt.verify)(
    token.split(' ')[1],
    process.env.JWT_SECRET,
  );

  if (!decoded)
    return next(
      new AppError('Authorization failed. Please log in or sign up'),
      401,
    );
  // Checking if user still present at database, if not - returning error;
  const candidate = await User.findById(decoded.userId);
  if (!candidate) return next(new AppError('User not found'), 400);

  // Checking if user changed password after JWT token was created, if changed - returning error;
  if (candidate.checkIfPasswordWasChanged(decoded.iat))
    return next(
      new AppError('Password was changed, please log in ones again', 401),
    );

  //
  req.user = candidate;
  next();
});

exports.restrictedTo = (...roles) => {
  return (req, res, next) => {
    if (!req.user)
      return next(new AppError('Unauthorized! Please log in', 401));
    const candidateRole = req.user.role;

    if (!roles.includes(candidateRole)) {
      return next(new AppError('Only admins could perform this action!'), 403);
    }

    next();
  };
};
exports.login = catchAsyncErrors(async (req, res, next) => {
  const { email, password } = req.body;

  if (!email || !password)
    return next(new AppError('Please provide email and password'), 400);

  const user = await User.findOne({ email }).select('+password').exec();
  if (!user)
    return next(
      new AppError('You have entered an invalid username or password'),
      400,
    );

  const passwordVerified = await bcrypt.compare(password, user.password);
  if (!passwordVerified)
    return next(
      new AppError('You have entered an invalid username or password'),
      400,
    );

  const token = await signToken(user._id);

  res.status(200).json({
    status: 'success',
    data: {
      token,
    },
  });
});

exports.setUserStatusToInactive = catchAsyncErrors(async (req, res, next) => {
  await User.findByIdAndUpdate(req.user._id, { accountActiveStatus: false });

  res.status(204).json({
    status: 'success',
    message: 'User successfully deactivated',
  });
});

exports.forgetPassword = catchAsyncErrors(async (req, res, next) => {
  const { email } = req.body;
  const user = await User.findOne({ email: email });

  if (!user) return next(new AppError('User with this email not found'), 400);

  // * Password reset token creation
  const resetToken = user.createPasswordResetToken();
  await user.save({ validateBeforeSave: false });

  const link = `${req.protocol}://${req.get(
    'host',
  )}/api/v1/users/resetPassword/${resetToken}`;

  await sendMyTextMail({
    from: 'raidchallenger23@gmail.com',
    to: email,
    subject: 'Forgot password?',
    text: `If you forget your HikeUp password please follow this link: ${link}. If not - just ignore this mail`,
  });

  res.status(200).json({
    status: 'success',
    message: 'Reset token was sent to your email',
  });
});

exports.resetPassword = catchAsyncErrors(async (req, res, next) => {
  // * Checking incoming data
  const { password, passwordConfirm } = req.body;
  if (password !== passwordConfirm)
    return next(
      new AppError('Password and password confirm should be the same'),
      400,
    );

  // * Encrypting the token to compare it to the token, saved in the database
  const encryptedPasswordResetToken = createHash('sha256')
    .update(req.params.token)
    .digest('hex');

  // * Searching for a user that is relevant to the given reset token
  const user = await User.findOne({
    passwordResetToken: encryptedPasswordResetToken,
  });

  // * Checking if user relevant to this token exists and token still not expired
  if (!user || user.passwordResetTokenExpires.getTime() < Date.now())
    return next(new AppError('Your token is invalid or expired', 401));

  // * Saving a user with a new password to the database
  user.password = password;
  user.passwordConfirm = passwordConfirm;
  user.save();

  res.status(200).json({
    status: 'success',
    message: 'Password successfully restored',
    data: {
      user,
    },
  });
});
