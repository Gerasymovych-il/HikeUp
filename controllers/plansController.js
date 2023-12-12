const Plan = require('../models/routePlanModel');
const catchAsyncErrors = require('../utils/catchAsyncErrors');
const AppError = require('../utils/AppError');
const gpxToGeoJson = require('../utils/gpxToGeoJSON');
const fs = require('fs');
exports.createNewPlan = catchAsyncErrors(async (req, res, next) => {
  const { routeName, description, date, difficulty } = req.body;
  let { equipment } = req.body;

  const tripPlanningDate = new Date(date);

  if (!tripPlanningDate instanceof Date || isNaN(tripPlanningDate))
    return next(
      new AppError('Date cannot be converted into a date format'),
      400,
    );

  if (!equipment || !Array.isArray(equipment) || equipment.length < 1) {
    equipment = ['No requirements'];
  }

  const author = req.user._id;
  const creationDate = new Date().toDateString();

  const newPlan = await Plan.create({
    routeName,
    description,
    date: tripPlanningDate,
    difficulty,
    equipment,
    author,
    creationDate,
  });

  res.status(201).json({
    status: 'success',
    data: {
      newPlan,
    },
  });
});

exports.getPlanById = catchAsyncErrors(async (req, res, next) => {
  const plan = await Plan.findById(req.params.id)
    .populate({ path: 'author', select: 'name role photo' })
    .exec();

  if (!plan)
    return next(new AppError('Route plan with this id doesn/`t exist'));

  res.status(200).json({
    status: 'success',
    data: {
      plan,
    },
  });
});

exports.uploadGpx = catchAsyncErrors(async (req, res, next) => {
  // Converting GPX file to GeoJson object
  const gj = gpxToGeoJson(req.file);
  // Checking if logged-in user is author of the plan
  const currentPlan = await Plan.findById(req.params.id);

  if (req.user._id.toString() !== currentPlan.author.toString()) {
    return next(
      new AppError('Only author of the plan could upload GPX tracks', 401),
    );
  }

  // Saving GeoJson object to database
  currentPlan.track = gj;
  await currentPlan.save();
  let serviceMessage = 'Temp file was not deleted';

  //Deleting temporary file
  if (fs.existsSync(req.file.path)) {
    fs.unlinkSync(req.file.path);
    serviceMessage = 'Temp file successfully deleted';
  }

  res.status(200).json({
    status: 'success',
    message: 'GPX track successfully uploaded and converted',
    serviceMessage,
    data: {
      currentPlan,
    },
  });
});
