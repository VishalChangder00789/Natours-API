const express = require("express");
const Tour = require("../model/tourModel");

class APIFeatures {
  constructor(query, queryString) {
    this.query = query;
    this.queryString = queryString;
  }

  filter() {
    // Basic Filtering
    const queryObj = { ...this.queryString };
    const excludedFields = ["page", "sort", "limit", "fields"];
    excludedFields.forEach((el) => delete queryObj[el]);

    // 1B) Advanced filtering
    let queryStr = JSON.stringify(queryObj);
    queryStr = queryStr.replace(/\b(gte|gt|lte|lt)\b/g, (match) => `$${match}`);

    this.query = this.query.find(JSON.parse(queryStr));

    return this;
  }

  sort() {
    if (this.queryString.sort) {
      const sortBy = this.queryString.sort.split(",").join(" ");
      this.query = this.query.sort(sortBy);
    } else {
      this.query = this.query.sort("-createdAt");
    }

    return this;
  }

  limitFields() {
    if (this.queryString.fields) {
      const fields = this.queryString.fields.split(",").join(" ");
      this.query = this.query.select(fields);
    } else {
      this.query = this.query.select("-__v");
    }

    return this;
  }

  paginate() {
    const page = this.queryString.page * 1 || 1;
    const limit = this.queryString.limit * 1 || 100;
    const skip = (page - 1) * limit;

    this.query = this.query.skip(skip).limit(limit);

    return this;
  }
}

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
      runValidators: true,
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
      message: "Invalid data sent",
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
      message: "Invalid data sent",
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
