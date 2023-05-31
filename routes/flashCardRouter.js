const express = require('express');
const flashCard = require('../controllers/flashCardController');
const authController = require('../controllers/authController');

const translationRouter = require('./translationRouter');
const favouriteRouter = require('./favouriteRouter');

const router = express.Router();

router.use('/:flashCardId/translation', translationRouter);
router.use('/:flashCardId/favourite', favouriteRouter);

router
  .route('/')
  .get(flashCard.getAllFlashCards)
  .post(
    authController.protect,
    authController.restrictTo('user'),
    flashCard.createFlashCard
  );

router
  .route('/:id')
  .get(flashCard.getFlashCardByID)
  .patch(
    authController.protect,
    authController.restrictTo('user', 'admin'),
    flashCard.isOwnerOrAdmin,
    flashCard.updateFlashCardByID
  )
  .delete(
    authController.protect,
    authController.restrictTo('admin', 'user'),
    flashCard.isOwnerOrAdmin,
    flashCard.deleteFlashCardByID
  );

module.exports = router;
