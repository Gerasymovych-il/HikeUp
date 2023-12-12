const mongoose = require('mongoose');
const { Schema } = mongoose;

const geometrySchema = new Schema({
  type: {
    type: String,
    enum: [
      'Point',
      'LineString',
      'Polygon',
      'MultiPoint',
      'MultiLineString',
      'MultiPolygon',
    ],
    required: true,
  },
  coordinates: [[Number]],
});

const featurePropertiesSchema = new Schema({
  name: String,
  desc: String,
  type: String,
});

const featureSchema = new Schema({
  type: {
    type: String,
    enum: ['Feature'],
    required: true,
  },
  properties: featurePropertiesSchema,
  geometry: geometrySchema,
});

const trackSchema = new Schema({
  type: {
    type: String,
    enum: ['FeatureCollection'],
  },
  features: [featureSchema],
});

module.exports = trackSchema;
