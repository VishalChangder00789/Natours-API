const express = require("express");
const app = express();
const morgan = require("morgan");
const tourRouter = require("./routes/tourRoutes");
const userRouter = require("./routes/userRoutes");

//! Middlewares
// It will be ran before req and res cycle ends

console.log(process.env.NODE_ENV);
// if (process.env.NODE_ENV === "developement") {
// Logging POST/api/v1/users 500 11.472 ms -58 MESSAGES LIKE THIS IS MORGAN
app.use(morgan("dev"));
// }

// Third party middleware
//Middleware (Recognize incoming req object has JSON object)
app.use(express.json());

// Making own  custom middleware
app.use((req, res, next) => {
  console.log("Running");
  req.requestTime = new Date().toISOString();
  next(); // if not called req and res cycle won't end
});

// Routing Middleware
app.use("/api/v1/tours", tourRouter);
app.use("/api/v1/users", userRouter);

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
