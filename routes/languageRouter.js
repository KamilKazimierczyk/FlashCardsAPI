const express = require("express");
const languageController = require("../controllers/languageController");

const router = express.Router();

router.route("/").get(languageController.getAllLanguages);

module.exports = router;
