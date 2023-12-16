const mongoose = require('mongoose');
const { Schema } = mongoose;

const photoLimit = (arr) => arr.length < 5;
const tagsLimit = (arr) => arr.length < 6;
const validateMediaFiles = (array) => {
  const regex = new RegExp(
    /[^\s]+(.*?).(jpe?g|png|gif|bmp|mp4|mov|avi|flv|wmv)$/,
  );
  let res = true;
  array.forEach((string) => {
    if (!regex.test(string)) res = false;
  });
  return res;
};

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
  media: {
    type: [String],
    validate: [
      {
        validator: photoLimit,
        msg: 'You can not upload more then 4 media files',
      },
      {
        validator: validateMediaFiles,
        msg: 'Only jpe?g|png|gif|bmp|mp4|mov|avi|flv|wmv are allowed',
      },
    ],
  },
  tags: {
    type: [String],
    validate: [tagsLimit, 'You can add no more then 5 tags'],
  },
});

module.exports = descriptionSchema;
