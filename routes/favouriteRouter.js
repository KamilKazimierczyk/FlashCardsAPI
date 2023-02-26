const express = require('express');
const favouriteController = require('../controllers/favouriteController');
const authController = require('../controllers/authController');

const router = express.Router({ mergeParams: true });

router.use(authController.protect);

router
  .route('/')
  .post(authController.restrictTo('user'), favouriteController.addFavourite);

router
  .route('/:id')
  .delete(
    authController.restrictTo('user'),
    favouriteController.isOwner,
    favouriteController.deleteFavourite
  );

module.exports = router;
