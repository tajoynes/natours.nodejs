const mongoose = require('mongoose');
const slugify = require('slugify');

// Mongoose schema defines the parameters of the documents within that collection.
const tourSchema = new mongoose.Schema(
  {
    //Schema Types
    name: {
      type: String,
      required: [true, 'Tour must have a name'], //Validator
      unique: true,
      trim: true,
      maxlenght: [40, 'Tour name must be less than or equal to 40 characters'],
      minlenght: [10, 'Tour name must be longer than 10 characters'],
      // validate: [validator.isAlpha, "Tour name must only contain characters"]
    },
    slug: {
      type: String,
    },
    duration: {
      type: Number,
      required: [true, 'Tour must have a duration'],
    },
    maxGroupSize: {
      type: Number,
      required: [true, 'Tour group size is required'],
    },
    difficulty: {
      type: String,
      required: [true, 'Tour difficulty must be set'],
      enum: {
        values: ['easy', 'medium', 'difficult'],
        messages: 'Difficulty is either: easy, medium, difficult',
      },
    },
    ratingAverage: {
      type: Number,
      default: 4.5,
      min: [1, 'Rating must be above 1'],
      max: [5, 'Rating cannot exceed 5'],
    },
    ratingQuantity: {
      type: Number,
      default: 0,
      max: 5,
    },
    price: {
      type: Number,
      required: [true, 'Tour must have a price'],
    },
    priceDiscount: {
      type: Number,
      validate: {
        validator: function (val) {
          //Validator this. keyword can only be executed on NEW document creation
          //Wll not work on update/patch document
          return val < this.price;
        },
        //{VALUE} get access to the discount price value
        message: 'Discount price ({VALUE}) should be lower than regular price',
      },
    },
    summary: {
      type: String,
      trim: true,
      required: [true, 'Tour must include desscription'],
    },
    description: {
      type: String,
      trim: true,
    },
    imageCover: {
      type: String,
      required: [true, 'Cover imaged must be inlcuded'],
    },
    images: [String],
    createdAt: {
      type: Date,
      default: Date.now(),
      select: false,
    },
    startDates: [Date],
    secretTour: {
      type: Boolean,
      default: false,
    },
  },
  {
    toJSON: { virtuals: true },
    toObject: { virtuals: true },
  }
);

tourSchema.virtual('durationWeeks').get(function () {
  return this.duration / 7;
});

//Mongoose document middleware; runs/executed before .save() and .create()
//Function() has accents to this. keyword pointing to the currently saved document
//Document Middleware example
tourSchema.pre('save', function (next) {
  this.slug = slugify(this.name, { lower: true });
  next();
});

//Query Middleware
tourSchema.pre(/^find/, function (next) {
  this.find({ secretTour: { $ne: true } });
  this.start = Date.now();
  next();
});

tourSchema.post(/^find/, function (docs, next) {
  console.log(`Query took ${Date.now() - this.start} milliseconds!`);
  next();
});

//Aggregation Middleware
tourSchema.pre('aggregate', function (next) {
  this.pipeline().unshift({ $match: { secretTour: { $ne: true } } });
  console.log(this.pipeline());
  next();
});

const Tour = mongoose.model('Tour', tourSchema);

module.exports = Tour;
