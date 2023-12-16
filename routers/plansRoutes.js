const express = require('express');
const router = express.Router();
const multer = require('multer');
const path = require('path');

// * Cofiguring Multer
const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, path.join(__dirname, '../temp/gpx'));
  },
  filename: function (req, file, cb) {
    cb(null, `${req.user._id}-${Date.now()}.gpx`);
  },
});
const upload = multer({ storage });

const authController = require('../controllers/authController');
const plansController = require('../controllers/plansController');

router.route('/').post(authController.protect, plansController.createNewPlan);
router.route('/:id').get(plansController.getPlanById);
router
  .route('/uploadGpx/:id')
  .post(
    authController.protect,
    upload.single('gpx'),
    plansController.uploadGpx,
  );

module.exports = router;
