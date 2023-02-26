const FlashCard = require('../models/flashCardModel');
const APIFeatures = require('../utils/apiFeatures');
const catchAsync = require('../utils/catchAsync');
const AppError = require('../utils/appError');

module.exports.isOwnerOrAdmin = catchAsync(async (req, res, next) => {
  if (req.user.role == 'admin') return next();

  const flashCard = await FlashCard.findById(req.params.id);
  if (flashCard.author != req.user.id)
    return next(
      new AppError('You do not have permission to perform this action', 403)
    );

  next();
});

module.exports.getAllFlashCards = catchAsync(async (req, res, next) => {
  const query = new APIFeatures(FlashCard.find(), req.query)
    .filter()
    .sort()
    .limitFields()
    .paginate();
  const flashCards = await query.query;

  res.status(200).json({
    status: 'success',
    data: {
      flashCards,
    },
  });
});

module.exports.getFlashCardByID = catchAsync(async (req, res, next) => {
  const flashCard = await FlashCard.findById(req.params.id).populate({
    path: 'words',
  });

  if (!flashCard) {
    return next(new AppError('No Flash Card found with that ID', 404));
  }

  res.status(200).json({
    status: 'success',
    data: {
      flashCard,
    },
  });
});

module.exports.createFlashCard = catchAsync(async (req, res, next) => {
  const data = { ...req.body, author: req.user.id };
  const flashCard = await FlashCard.create(data);

  res.status(201).json({
    status: 'success',
    data: {
      flashCard,
    },
  });
});

module.exports.updateFlashCardByID = catchAsync(async (req, res, next) => {
  const flashCard = await FlashCard.findByIdAndUpdate(req.params.id, req.body, {
    new: true,
    runValidators: true,
  });

  if (!flashCard) {
    return next(new AppError('No Flash Card found with that ID', 404));
  }

  res.status(200).json({
    status: 'success',
    data: {
      flashCard,
    },
  });
});

module.exports.deleteFlashCardByID = catchAsync(async (req, res, next) => {
  const flashCard = await FlashCard.findByIdAndDelete(req.params.id);

  if (!flashCard) {
    return next(new AppError('No Flash Card found with that ID', 404));
  }

  res.status(204).json({
    status: 'success',
    data: null,
  });
});
