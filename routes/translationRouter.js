const express = require('express');
const translationController = require('../controllers/translationController');
const authController = require('../controllers/authController');

const router = express.Router({ mergeParams: true });

router.use(authController.protect);

router
  .route('/')
  .get(translationController.getAllTranslations)
  .post(
    authController.restrictTo('user'),
    translationController.createTranslations
  );

router
  .route('/:id')
  .patch(
    authController.restrictTo('user', 'admin'),
    translationController.isOwnerOrAdmin,
    translationController.updateTranslationByID
  )
  .delete(
    authController.restrictTo('admin', 'user'),
    translationController.isOwnerOrAdmin,
    translationController.deleteTranslationByID
  );

module.exports = router;
