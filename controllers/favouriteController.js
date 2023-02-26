const Favourite = require('../models/favouriteModel');
const catchAsync = require('../utils/catchAsync');
const AppError = require('../utils/appError');

module.exports.isOwner = catchAsync(async (req, res, next) => {
  const favourite = await Favourite.findById(req.params.id);
  if (favourite.user != req.user.id)
    return next(
      new AppError('You do not have permission to perform this action', 403)
    );

  next();
});

module.exports.addFavourite = catchAsync(async (req, res, next) => {
  const data = { user: req.user.id, flashCard: req.params.flashCardId };

  const favourite = await Favourite.create(data);

  res.status(201).json({
    status: 'success',
    data: {
      favourite,
    },
  });
});

module.exports.deleteFavourite = catchAsync(async (req, res, next) => {
  const favourite = await Favourite.findByIdAndDelete(req.params.id);

  if (!favourite) {
    return next(new AppError('No Flash Card found with that ID', 404));
  }

  res.status(204).json({
    status: 'success',
    data: null,
  });
});
