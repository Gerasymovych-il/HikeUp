const Review = require('../models/routeReviewModel');
const catchAsyncErrors = require('../utils/catchAsyncErrors');
const AppError = require('../utils/AppError');
const gpxToGeoJson = require('../utils/gpxToGeoJSON');
const fs = require('fs');

exports.createNewReview = catchAsyncErrors(async (req, res, next) => {
  const { routeName, description, date, difficulty } = req.body;
  let { equipment, suitableSeasons } = req.body;

  let tripDate = new Date(date);
  tripDate =
    !tripDate instanceof Date || isNaN(tripDate) ? Date.now() : tripDate;

  const author = req.user._id;

  if (!equipment || !Array.isArray(equipment) || equipment.length < 1) {
    equipment = ['No requirements'];
  }

  if (!suitableSeasons || suitableSeasons.length < 1)
    suitableSeasons = ['Not set'];

  if (suitableSeasons.includes('All seasons') && suitableSeasons.length > 1) {
    suitableSeasons = ['All seasons'];
  }

  if (suitableSeasons.includes('Not set') && suitableSeasons.length > 1) {
    suitableSeasons = ['Not set'];
  }

  const createdReview = await Review.create({
    routeName,
    description,
    date,
    difficulty,
    suitableSeasons,
    author,
    date: tripDate,
    equipment,
  });

  res.status(201).json({
    status: 'success',
    data: {
      createdReview,
    },
  });
});
