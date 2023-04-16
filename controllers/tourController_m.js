const express = require("express");
const Tour = require("../model/tourModel");

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
  // Newly created document stored in newTour and needed to be saved in the collections in db
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
    const allTours = await Tour.find();

    res.status(201).json({
      status: "success",
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
