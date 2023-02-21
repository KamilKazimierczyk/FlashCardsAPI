const languages = require("../utils/languageArray");

module.exports.getAllLanguages = (req, res) => {
  res.status(200).json({
    status: "success",
    data: {
      languages,
    },
  });
};
