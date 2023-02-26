const mongoose = require('mongoose');
const FlashCard = require('./flashCardModel');

const translationSchema = new mongoose.Schema(
  {
    word: {
      type: String,
      required: [true, 'The translation must have a starting word'],
      trim: true,
    },
    translation: {
      type: String,
      required: [true, 'The translation must have a translated word'],
      trim: true,
    },
    flashCard: {
      type: mongoose.Schema.ObjectId,
      ref: 'FlashCard',
      required: [true, 'Translation must belong to FlashCard.'],
    },
  },
  {
    id: false,
  }
);

translationSchema.index({ flashCard: 1 });

translationSchema.statics.calcTranslations = async function (flashCardId) {
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
      translationsCount: stats[0].amount,
    });
  } else {
    await FlashCard.findByIdAndUpdate(flashCardId, {
      translationsCount: 0,
    });
  }
};

translationSchema.post('save', function () {
  this.constructor.calcTranslations(this.flashCard);
});

translationSchema.pre('findOneAndDelete', async function (next) {
  const translation = await this.model.findById(this._conditions._id);
  const flashCard = await FlashCard.findById(translation.flashCard);
  this.flashCardId = flashCard._id;
  next();
});

translationSchema.post('findOneAndDelete', async function () {
  await this.model.calcTranslations(this.flashCardId);
});

const Translation = mongoose.model('Translation', translationSchema);

module.exports = Translation;
