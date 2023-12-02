const mongoose = require('mongoose');
const { Schema } = mongoose;

const photoLimit = (arr) => arr.length < 5;
const tagsLimit = (arr) => arr.length < 6;

const descriptionSchema = new Schema({
  shortDesc: {
    type: String,
    minLength: [10, 'Short description should be minimum 10 characters long'],
    maxLength: [80, 'Short description should be maximum 80 characters long'],
  },
  description: {
    type: String,
    maxLength: [
      2500,
      'Short description should be maximum 2500 characters long',
    ],
  },
  photos: {
    type: [String],
    validate: [photoLimit, 'You can not upload more then 4 photo'],
  },
  tags: {
    type: [String],
    validate: [tagsLimit, 'You can add no more then 5 tags'],
  },
});

module.exports = descriptionSchema;
