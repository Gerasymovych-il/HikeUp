const mongoose = require('mongoose');

const { Schema } = mongoose;

const ratingsAndCommentsSchema = new Schema({
  user: {
    type: Schema.ObjectId,
    ref: 'User',
    required: true,
  },
  review: {
    type: Schema.ObjectId,
    ref: 'Review',
    required: true,
  },
  rating: {
    type: Number,
    default: 0,
    min: [0, 'Rating could not be lower then 0'],
    max: [5, 'Rating could not be higher then 5'],
  },
  comment: {
    type: String,
    maxLength: [1000, 'Comment should be maximum 1000 characters long'],
  },
});
