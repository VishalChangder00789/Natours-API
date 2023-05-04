const express = require("express");
const app = express();
const morgan = require("morgan");
const tourRouter = require("./routes/tourRoutes");
const userRouter = require("./routes/userRoutes");
const AppError = require("./utils/appError");
const globalErrorHandler = require("./controllers/errorController");

//! Middlewares
// It will be ran before req and res cycle ends

// console.log(process.env.NODE_ENV);

// if (process.env.NODE_ENV === "developement") {
// Logging POST/api/v1/users 500 11.472 ms -58 MESSAGES LIKE THIS IS MORGAN
app.use(morgan("dev"));
// }

// Third party middleware
//Middleware (Recognize incoming req object has JSON object)
app.use(express.json());

// Making own  custom middleware
app.use((req, res, next) => {
  // console.log("Running");
  req.requestTime = new Date().toISOString();
  next(); // if not called req and res cycle won't end
});

// Routing Middleware
app.use("/api/v1/tours", tourRouter);
app.use("/api/v1/users", userRouter);

// MIDDLEWARE UNHANDLED ROUTES

// if we are reaching at this point that means all the above routes are not found

app.all("*", (req, res, next) => {
  //! Simple way of handling
  // res.status(404).json({
  //   status: "fail",
  // ? req.originalUrl is the url typed in the postman
  //   message: `Route not found : ${req.originalUrl}`,
  // });
  // next();
  //! Bit optimised way of handling
  // const err = new Error(`Route not found : ${req.originalUrl}`); // passed string is err.message
  // err.status = "fail";
  // err.statusCode = 404;
  //! Handling through a custom Error class (long way)
  // const err = new AppError(`Route not found : ${req.originalUrl}`, 404);  // or
  //? If the next method recieves an argument it will automatically think it's an error
  //? No matter what the argument is , it is an error if it is passed in the next method
  //? Moreover it will also skip all the middlewares from the stack

  // next(err);  // advance way of doing is written in bottom.  In both cases the middleware to handle the error
  // will run

  //! Best way to handle
  next(new AppError(`Route not found : ${req.originalUrl}`, 404));
});

// ERROR HANDLING MIDDLEWARE
// Express automatically understands that the middleware is for error handling if it has 4 specific arguments

app.use(globalErrorHandler);

//#region --------------------------- OLD ROUTING WAY ---------------------------
// ! Still Complex : OLD WAY
// ! having same routes
// app.get("/api/v1/tours", getAllTours);
// app.post(`/api/v1/tours`, postTour);
// !having same routes
// app.get("/api/v1/tours/:id", getTour);
// app.patch("/api/v1/tours/:id", updateTour);
// app.delete("/api/v1/tours/:id", deleteTour);

// // Todo simplified : NEW WAY
// //! Tour route
// app.route("/api/v1/tours").get(getAllTours).post(postTour);
// app
//   .route("/api/v1/tours/:id")
//   .get(getTour)
//   .patch(updateTour)
//   .delete(deleteTour);

// //! User routes
// app.route("/api/v1/users").get(getAllUsers).post(postUser);
// app
//   .route("/api/v1/users/:id")
//   .get(getUser)
//   .patch(updateUser)
//   .delete(deleteUser);

//#endregion --------------------------- OLD ROUTING WAY ---------------------------

module.exports = app;
