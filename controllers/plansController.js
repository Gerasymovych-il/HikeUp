const Plan = require('../models/routePlanModel');
const catchAsyncErrors = require('../utils/catchAsyncErrors');
const AppError = require('../utils/AppError');

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

  console.log(req.user);
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
  const plan = await Plan.findById(req.params.id);

  if (!plan)
    return next(new AppError('Route plan with this id doesn/`t exist'));

  res.status(200).json({
    status: 'success',
    data: {
      plan,
    },
  });
});
