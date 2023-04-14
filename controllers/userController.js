const express = require("express");

exports.getAllUsers = (req, res) => {
  res.status(500).json({
    status: "error",
    message: "Route not defined get all user",
  });
};

exports.getUser = (req, res) => {
  res.status(500).json({
    status: "error",
    message: "Route not defined get user",
  });
};
exports.postUser = (req, res) => {
  res.status(500).json({
    status: "error",
    message: "Route not defined post user",
  });
};

exports.updateUser = (req, res) => {
  res.status(500).json({
    status: "error",
    message: "Route not defined update user",
  });
};

exports.deleteUser = (req, res) => {
  res.status(500).json({
    status: "error",
    message: "Route not defined delete user",
  });
};
