const mongoose = require('mongoose');
const FlashCard = require('./flashCardModel');

const favouriteSchema = new mongoose.Schema(
  {
    user: {
      type: mongoose.Schema.ObjectId,
      ref: 'User',
      required: [true, 'You must provide user data for favourite.'],
    },
    flashCard: {
      type: mongoose.Schema.ObjectId,
      ref: 'FlashCard',
      required: [true, 'You must provide FlashCard data for favourite.'],
    },
    addDate: {
      type: Date,
      default: Date.now(),
    },
  },
  {
    id: false,
  }
);

favouriteSchema.index({ flashCard: 1, user: 1 }, { unique: true });

favouriteSchema.statics.calcFavourites = async function (flashCardId) {
  const stats = await this.aggregate([
    {
      $match: { flashCard: flashCardId },
    },
    {
      $group: {
        _id: '$flashCard',
        amount: { $sum: 1 },
      },
    },
  ]);

  if (stats.length > 0) {
    await FlashCard.findByIdAndUpdate(flashCardId, {
      favouritesCount: stats[0].amount,
    });
  } else {
    await FlashCard.findByIdAndUpdate(flashCardId, {
      favouritesCount: 0,
    });
  }
};

favouriteSchema.post('save', function () {
  this.constructor.calcFavourites(this.flashCard);
});

favouriteSchema.pre('findOneAndDelete', async function (next) {
  const translation = await this.model.findById(this._conditions._id);
  const flashCard = await FlashCard.findById(translation.flashCard);
  this.flashCardId = flashCard._id;
  next();
});

favouriteSchema.post('findOneAndDelete', async function () {
  await this.model.calcFavourites(this.flashCardId);
});

const Favourite = mongoose.model('Favourite', favouriteSchema);

module.exports = Favourite;
