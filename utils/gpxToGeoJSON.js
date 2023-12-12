const tj = require('@mapbox/togeojson');
const { DOMParser } = require('xmldom');
const domParser = require('xmldom').DOMParser;
const fs = require('fs');

const convertGpxToGeoJSON = (file) => {
  const parsedFile = new domParser().parseFromString(
    fs.readFileSync(file.path, 'utf8'),
  );
  const geoJsonData = tj.gpx(parsedFile);
  return geoJsonData;
};

module.exports = convertGpxToGeoJSON;
