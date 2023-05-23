const mongoose = require('mongoose');
const languages = require('../utils/languageArray');

const flashCardSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: [true, 'Flash Cards must have a name'],
      trim: true,
      minlength: [3, 'Flash Cards name must contains at least 3 letters'],
      maxlength: [50, "Flash Cards name cann't contain more then 50 letters"],
    },
    description: {
      type: String,
      trim: true,
      required: [true, 'Flash Cards must have a description'],
    },
    tags: [String],
    favouritesCount: {
      type: Number,
      default: 0,
    },
    translationsCount: {
      type: Number,
      default: 0,
    },
    createdAt: {
      type: Date,
      default: Date.now(),
      select: false,
    },
    translatedFrom: {
      type: String,
      required: [true, 'Flash Cards language must be choosen'],
      enum: {
        values: languages,
        message: 'The Language you choose is not supported',
      },
    },
    translatedTo: {
      type: String,
      required: [true, 'Flash Cards language must be choosen'],
      enum: {
        values: languages,
        message: 'The Language you choose is not supported',
      },
    },
    author: {
      type: mongoose.Schema.ObjectId,
      ref: 'User',
      required: [true, 'FlashCard must have an author.'],
    },
  },
  {
    toJSON: { virtuals: true },
    toObject: { virtuals: true },
    id: false,
  }
);

flashCardSchema.virtual('words', {
  ref: 'Translation',
  foreignField: 'flashCard',
  localField: '_id',
});

flashCardSchema.index({ name: 'text', description: 'text' });

const FlashCard = mongoose.model('FlashCard', flashCardSchema);

module.exports = FlashCard;
