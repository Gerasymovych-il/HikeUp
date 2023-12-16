const mongoose = require('mongoose');

const { Schema } = mongoose;
const descriptionSchema = require('./descriptionSchema');
const trackSchema = require('./trackSchema');

const routeReviewSchema = new Schema({
  routeName: {
    type: String,
    required: [true, 'Route name is a required field.'],
    minLength: [5, 'Route name should be minimum 5 characters long'],
    maxLength: [20, 'Route name should be maximum 20 characters long'],
  },
  description: descriptionSchema,
  date: {
    type: Date,
    select: false,
  },
  dateString: {
    type: String,
  },
  track: {
    type: trackSchema,
    select: false,
  },
  author: {
    type: Schema.ObjectId,
    ref: 'User',
    required: true,
  },
  equipment: {
    type: [String],
    enum: [
      'No requirements',
      'Camping tent',
      'Backpacking Tent',
      'Change of clothing',
      'Footwear for water crossings',
    ],
  },
  difficulty: {
    type: String,
    enum: ['Not set', 'Easy', 'Moderate', 'Difficult', 'Expert'],
    default: 'Not set',
  },
  distance: {
    type: String,
    default: 'Not calculated',
  },
  suitableSeasons: {
    type: [String],
    enum: ['Winter', 'Spring', 'Summer', 'Autumn', 'Not set', 'All seasons'],
    default: ['Not set'],
  },
  numberOfRatings: {
    type: Number,
    default: 0,
  },
  averageRating: {
    type: Number,
    default: 0,
  },
});

module.exports = mongoose.model('Review', routeReviewSchema);
