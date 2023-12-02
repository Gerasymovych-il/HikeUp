const express = require('express');
const router = express.Router();

const authController = require('../controllers/authController');
const plansController = require('../controllers/plansController');

router.route('/').post(authController.protect, plansController.createNewPlan);
router.route('/:id').get(plansController.getPlanById);

module.exports = router;
