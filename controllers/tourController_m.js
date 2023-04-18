const express = require("express");
const Tour = require("../model/tourModel");

class APIFeatures {
  constructor(query, queryString) {
    this.query = query;
    this.queryString = queryString;
  }

  filter() {
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
    //#region  ---- CLEAN IMPLEMENTATION  ----
    // console.log("Hovering\n", req.query);
    // //1. FILTERING WAY 1 :: BUILDING QUERY AND : Basic

    // // const allTours = await Tour.find();   // without filtering

    // // const queryObj = req.query; // This is creating a pointer so whatever we do in queryobj will happen in req.query
    // const queryObj = { ...req.query }; // This is a copy :: in case of arrays and objects
    // // console.log("Double Hovering : ", "======================>", queryObj);
    // const excludedFields = ["page", "sort", "limit", "fields"];
    // excludedFields.forEach((el) => delete queryObj[el]);

    // //2. ADVANCED FILTERING

    // let queryStr = JSON.stringify(queryObj);
    // // console.log(queryStr);

    // //with regular expression
    // queryStr = queryStr.replace(/\b(gte|gt|lte|lt)\b/g, (match) => `$${match}`);

    // // query obj
    // // {duration : {$gte:5},difficulty:'easy'}
    // // erq.query
    // // {duration :{gte:5},difficulty:'easy'}

    // // Notice how the duration doesn't have the mongo db $ operator in the actual req.query obj
    // // we need to add it back

    // let query = Tour.find(JSON.parse(queryStr));
    // console.log("=======================>");
    // console.log(query._conditions);

    // //3. SORTING
    // if (req.query.sort) {
    //   const sortBy = req.query.sort.split(",").join(" ");
    //   console.log("My query", sortBy);
    //   query = query.sort(sortBy);
    // } else {
    //   query = query.sort("-createdAt");
    // }

    // //4. FIELD LIMITS : WHAT ALL THE USER WANTS TO SEE
    // if (req.query.fields) {
    //   const fields = req.query.fields.split(",").join(" ");
    //   console.log(fields);
    //   query = query.select(fields);
    // } else {
    //   query = query.select("-__v"); // - is excluding __v is the key in json
    // }

    //5. PAGINATION

    // page=2&limit=10 : page1 : 1-10, page2=11-20, page3=21-30 ...
    // if the user wants to go to page 2 and each page contains 10 results/documents then we need to
    // skip 10 documents to reach to the 11th document because , the page2 starts with (11-20)

    // somehow we need to calculate how many documents to skip according to the page number mentioned
    // by the user

    // const page = req.query.page * 1 || 1;
    // const limit = req.query.limit * 1 || 100;
    // const _skip = (page - 1) * limit;

    // query = query.skip(_skip).limit(limit); //exactly the meaning as above
    // if (req.query.page) {
    //   const numTours = await Tour.countDocuments();
    //   if (skip >= numTours) {
    //     throw new Error("This page does not exist");
    //   }
    // }

    //#endregion  ---- CLEAN IMPLEMENTATION  ----

    // EXECUTE QUERY

    /* 
    
    */
    const features = new APIFeatures(Tour.find(), req.query)
      // .filter()
      // .limiting()
      // .sorting()
      // .paginate();
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
