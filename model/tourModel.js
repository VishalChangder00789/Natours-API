const mongoose = require("mongoose");
const slugify = require("slugify");
const validator = require("validator");

const tourSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: [true, "A tour must have a name"],
      unique: true,
      trim: true,
      // validators
      maxlength: [40, "A tour name cannot exceed 40 characters"],
      minlength: [10, "A tour name should atleast contain 10 characters"],
      // isAlpha validates if the value entered is alpha numeric or not
      // Demo of a library : Not using because it is not accepting spaces
      // validate: [validator.isAlpha, "Tour name must only contains characters"],
    },
    slug: { type: String },
    duration: {
      type: Number,
      required: [true, "A tour must have a duration"],
    },
    maxGroupSize: {
      type: Number,
      required: [true, "A tour must have a group size"],
    },
    difficulty: {
      type: String,
      required: [true, "A tour must have a diffficulty"],
      enum: {
        values: ["easy", "medium", "difficult"],
        message: "Difficulty must be medium easy or difficult",
      },
    },
    ratingsAverage: {
      type: Number,
      default: 4.75,
      min: [1, "Rating must be above 1"],
      max: [5, "Rating must be below 5"],
    },
    ratingsQuantity: {
      type: Number,
      default: 0,
    },
    price: {
      type: Number,
      required: [true, "A tour must have a price"],
    },
    priceDiscount: {
      type: Number,
      // Only can be used while creating a new document and not updating
      validate: {
        validator: function (val) {
          return val < this.price;
        },
        message: "Discount price ({VALUE}) must be below the regular price",
      },
    },
    summary: {
      type: String,
      trim: true,
      required: [true, "A tour must have a summary"],
    },
    description: {
      type: String,
      trim: true,
    },
    imageCover: {
      type: String,
      required: [true, "A tour must have a image"],
    },
    images: [String],
    createdAt: {
      type: Date,
      default: Date.now(),
      // we dont want the anybody to see the createdAt field so we do select : false
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

/// This is not a part of the database.
// It is the thing which is not saved in the database but shown to the user
// Because it is unnecessary to store in the databaase

tourSchema.virtual("durationWeeks").get(function () {
  return this.duration / 7;
});

// DOCUMENT MIDDLEWARE
// :: This function will be called before saving the document .save() and .create()
tourSchema.pre("save", function (next) {
  this.slug = slugify(this.name, { lower: true });
  next();
});

// tourSchema.pre("save", function (next) {
//   let customDifficulty = this.difficulty;
//   const replaceDifficulty = {
//     eas: "easy",
//     diff: "difficult",
//     med: "medium",
//   };

//   replaceDifficulty.array.forEach(el => {
//     if(customDifficulty)
//   });

//   if (customDifficulty.startsWith()) next();
// });

// QUERY MIDDLEWARE
// method runs before or after a certain query is executed

//! Main and usefull
// tourSchema.pre("find", function (next) {
//   // used case : FOR SECRET MIDDLEWARE
//   // this will be the query object

//   this.find({ secretTour: { $ne: true } });
//   next();
// });

// For findOne also :: 1 way
// tourSchema.pre("findOne", function (next) {
//   // used case : FOR SECRET MIDDLEWARE
//   // this will be the query object
//   this.find({ secretTour: { $ne: true } });
//   next();
// });

// Added comment for modification

// For find and findOne also :: 2WAY :: WE USE REGULAR EXPRESSION
tourSchema.pre(/^find/, function (next) {
  // all the strings that starts with find
  this.find({ secretTour: { $ne: true } });

  this.start = Date.now();
  next();
});

tourSchema.post(/^find/, function (docs, next) {
  // docs are all the documents in the database
  // console.log(docs);
  // console.log(`Query took : ${Date.now() - this.start} mills`);
  next();
});

// AGGREGATION MIDDLEWARE
tourSchema.pre("aggregate", function (next) {
  // this is the aggregate object
  this.pipeline().unshift({
    $match: {
      secretTour: { $ne: true },
    },
  });

  next();
});

const Tour = mongoose.model("Tour", tourSchema);

module.exports = Tour;
