const express = require("express");

//Todo: Read Data
//?? JSON.parase  ()  =>
//?? This statement will take all the data from tours-simple.json file in a json format
//?? Then convert it to Javascript object and store in tours variable.

const fs = require("fs");
const filePath = `${__dirname}/../dev-data/data/tours-simple.json`;
const tours = JSON.parse(fs.readFileSync(filePath));

//!Helper methods
exports.checkId = (req, res, next, val) => {
  console.log(`Tour id is : ${val}`);
  if (val > tours.length) {
    return res.status(404).json({
      status: "fail",
      message: "Invalid id",
    });
  }
  next();
};

exports.checkBody = (req, res, next) => {
  console.log("Check body running");
  if (!req.body.name || !req.body.price) {
    return res.status(400).json({
      status: "fail",
      message: "Price and Name absent",
    });
  }
  next();
};

//! Methods
exports.getAllTours = (req, res) => {
  console.log(req.requestTime);
  res.status(200).json({
    status: "success",
    requestAt: req.requestTime,
    results: tours.length,
    data: {
      tours: tours,
    },
  });
};
exports.getTour = (req, res) => {
  const newTour = tours.find((el) => el.id === req.params.id * 1);

  res.status(200).json({
    status: "success",
    data: {
      tours: newTour,
    },
  });
};

exports.postTour = (req, res) => {
  const newId = tours[tours.length - 1].id + 1;
  const newTour = Object.assign({ id: newId }, req.body);

  tours.push(newTour);
  fs.writeFile(filePath, JSON.stringify(tours), (err) => {
    res.status(201).json({
      status: "success",
      data: {
        tour: newTour,
      },
    });
  });
};

exports.updateTour = (req, res) => {
  res.status(200).json({
    status: "success",
    data: {
      tour: "<Updated tour here..>",
    },
  });
};

exports.deleteTour = (req, res) => {
  res.status(204).json({
    status: "success",
    data: null,
  });
};
