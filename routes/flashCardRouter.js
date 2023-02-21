const express = require("express");
const flashCard = require("../controllers/flashCardController");

const router = express.Router();

router
  .route("/")
  .get(flashCard.getAllFlashCards)
  .post(flashCard.createFlashCard);

router
  .route("/:id")
  .get(flashCard.getFlashCardByID)
  .patch(flashCard.updateFlashCardByID)
  .delete(flashCard.deleteFlashCardByID);

module.exports = router;
