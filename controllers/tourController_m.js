const express = require("express");
const Tour = require("../model/tourModel");
const APIFeatures = require("../utils/apiFeature");

// USAGE OF MIDDLEWARE
exports.aliasTopTours = async (req, res, next) => {
  console.log("Middleware running");
  req.query.limit = "5";
  req.query.sort = "-ratingsAverage,-difficulty,price";
  req.query.fields = "name,price,ratingsAverge,summary,difficulty";
  next();
};

exports.deleteTour = async (req, res) => {
  try {
    await Tour.findByIdAndDelete(req.params.id);
    res.status(204).json({
      status: "success",
      message: "Deleted Successfully",
    });
  } catch (err) {
    res.status(400).json({
      status: "fail",
      message: "Could not delete",
    });
  }
};

exports.updateTour = async (req, res) => {
  try {
    const updatedTour = await Tour.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
      runValidators: true, // this is the reason why we get the validation error in the model for name
      // if the name is <10 characters or >40 characters

      // will not work in few cases like discount custom validator
    });
    res.status(201).json({
      status: "success",
      data: {
        tour: updatedTour,
      },
    });
  } catch (err) {
    res.status(400).json({
      status: "fail",
      message: err,
    });
  }
};

exports.getTour = async (req, res) => {
  try {
    console.log("=========");
    console.log(req.body);
    console.log(req.params);
    // Tour.findOne({_id = req.params.id})  is same as below
    const tour = await Tour.findById(req.params.id);
    res.status(201).json({
      status: "success",
      data: {
        tour: tour,
      },
    });
  } catch (err) {
    res.status(400).json({
      status: "fail",
      message: "Invalid data sent",
    });
  }
};

exports.createTour = async (req, res) => {
  // Newly created document stored in newTour and will be saved in the collections in db
  try {
    const newTour = await Tour.create(req.body);
    res.status(201).json({
      status: "success",
      data: {
        tour: newTour,
      },
    });
  } catch (err) {
    res.status(400).json({
      status: "fail",
      message: err,
    });
  }
};

exports.getAllTours = async (req, res) => {
  try {
    const features = new APIFeatures(Tour.find(), req.query)
      .filter()
      .sort()
      .limitFields()
      .paginate();
    const allTours = await features.query;

    // SENDING RESPONSE
    res.status(201).json({
      status: "success",
      results: allTours.length,
      data: {
        tours: allTours,
      },
    });
  } catch (err) {
    res.status(400).json({
      status: "fail",
      message: "Something went wrong",
    });
  }
};

// Aggregation pipeline

// Learning aggregation pipeline :

exports.getTourStats = async (req, res) => {
  try {
    const stats = await Tour.aggregate([
      {
        $match: { ratingsAverage: { $gte: 2.0 } },
      },

      {
        $group: {
          _id: { $toUpper: "$difficulty" },
          num: { $sum: 1 },
          numRatings: { $sum: "$ratingsQuantity" },
          avgRating: { $avg: "$ratingsAverage" },
          avgPrice: { $avg: "$price" },
          minPrice: { $min: "$price" },
          maxPrice: { $max: "$price" },
        },
      },
      {
        $sort: {
          // use the field name we used in the above group paramter
          // why? : because in the aggregation pipeline we have the above keys only
          avgPrice: 1, // 1 for ascending // -1 for descending
          // ratingsAverage: 1,
        },
      },

      // !CAN BE REPEATED

      // {
      //   $match: {
      //     _id: { $ne: "EASY" },
      //   },
      // },
    ]);

    res.status(200).json({
      status: "success",
      data: {
        stats,
      },
    });
  } catch (err) {
    res.status(400).json({
      status: "fail",
      message: err,
    });
  }
};

exports.getMontlyPlan = async (req, res) => {
  try {
    const year = req.params.year * 1;
    const plan = await Tour.aggregate([
      {
        $unwind: "$startDates",
      },
      {
        $match: {
          startDates: {
            $gte: new Date(`${year}-01-01`),
            $lte: new Date(`${year + 2}-12-31`),
          },
        },
      },
      {
        $group: {
          _id: { $month: "$startDates" },
          numTourStarts: { $sum: 1 },
          // what tours are available with name in an array >> selecting name field from the document
          tours: { $push: "$name" },
        },
      },
      {
        $addFields: { month: `$_id`, year: `${year}` },
      },
      {
        $project: {
          _id: 0, // no longer shows up
        },
      },
      {
        $sort: {
          numTourStarts: -1,
        },
      },
    ]);

    res.status(200).json({
      status: "success",
      data: {
        plan,
      },
    });
  } catch (err) {
    res.status(400).json({
      status: "fail",
      message: err,
    });
  }
};
