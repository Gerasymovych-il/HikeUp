const express = require('express');
const router = express.Router();

const authController = require('../controllers/authController');
const reviewsController = require('../controllers/reviewsController');

router
  .route('/')
  .post(authController.protect, reviewsController.createNewReview);

module.exports = router;
