const Translation = require('../models/translationModel');
const catchAsync = require('../utils/catchAsync');
const AppError = require('../utils/appError');
const APIFeatures = require('../utils/apiFeatures');
const FlashCard = require('../models/flashCardModel');

module.exports.isOwnerOrAdmin = catchAsync(async (req, res, next) => {
  if (req.user.role == 'admin') return next();

  const flashCard = await FlashCard.findById(req.params.flashCardId);
  if (flashCard.author != req.user.id)
    return next(
      new AppError('You do not have permission to perform this action', 403)
    );

  next();
});

module.exports.getAllTranslations = catchAsync(async (req, res, next) => {
  const query = new APIFeatures(
    Translation.find({ flashCard: req.params.flashCardId }),
    req.query
  ).paginate();
  const translations = await query.query;

  res.status(200).json({
    status: 'success',
    data: {
      translations,
    },
  });
});

module.exports.createTranslations = catchAsync(async (req, res, next) => {
  const data = req.body.translations.map((translation) => {
    return { ...translation, flashCard: req.params.flashCardId };
  });
  const translation = await Translation.create(data);

  res.status(201).json({
    status: 'success',
    data: {
      translation,
    },
  });
});

module.exports.updateTranslationByID = catchAsync(async (req, res, next) => {
  const translation = await Translation.findByIdAndUpdate(
    req.params.id,
    req.body,
    {
      new: true,
      runValidators: true,
    }
  );

  if (!translation) {
    return next(new AppError('No Flash Card found with that ID', 404));
  }

  res.status(200).json({
    status: 'success',
    data: {
      translation,
    },
  });
});

module.exports.deleteTranslationByID = catchAsync(async (req, res, next) => {
  const translation = await Translation.findByIdAndDelete(req.params.id);

  if (!translation) {
    return next(new AppError('No Flash Card found with that ID', 404));
  }

  res.status(204).json({
    status: 'success',
    data: null,
  });
});
