const mongoose = require('mongoose');

const { Schema } = mongoose;
const descriptionSchema = require('./descriptionSchema');

const routePlanSchema = new Schema({
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
    default: 'Unknown',
  },
  distance: {
    type: String,
    default: 'Not calculated',
  },
  difficulty: {
    type: String,
    enum: ['Not set', 'Easy', 'Moderate', 'Difficult', 'Expert'],
    default: 'Not set',
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
  author: {
    type: Schema.ObjectId,
    required: true,
  },
  creationDate: String,
});

routePlanSchema.pre('save', function (next) {
  if (this.date) this.dateString = this.date.toDateString();
  next();
});

module.exports = mongoose.model('RoutePlan', routePlanSchema);
