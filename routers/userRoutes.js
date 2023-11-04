const express = require('express');
const router = express.Router();
const userController = require('../controllers/userController');
const authController = require('../controllers/authController');

// * Authentification and authorization routes
router
  .route('/')
  .post(
    authController.protect,
    authController.restrictedTo('admin'),
    userController.createNewUser,
  );
router.route('/login').post(authController.login);
router.route('/forgetPassword').post(authController.forgetPassword);
router.route('/resetPassword/:token').patch(authController.resetPassword);

router
  .route('/deactivateMyAccount')
  .delete(authController.protect, authController.setUserStatusToInactive);

// * CRUD operations routes
router.route('/:id').get(authController.protect, userController.getUserById);
router
  .route('/updateMyPassword')
  .patch(authController.protect, userController.updatePassword);
router
  .route('/updateMyData')
  .patch(authController.protect, userController.updateData);

module.exports = router;
