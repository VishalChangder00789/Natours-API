const express = require("express");
const tourController = require("../controllers/tourController");
const tourController_m = require("../controllers/tourController_m");
const router = express.Router();

//! Old way with no databse

// val is the id or paramter which is passed in the url
// router.param("id", tourController.checkId);

// router
//   .route("/")
//   .get(tourController.getAllTours)
//   .post(tourController.checkBody, tourController.postTour);
// router
//   .route("/:id")
//   .get(tourController.getTour)
//   .patch(tourController.updateTour)
//   .delete(tourController.deleteTour);

//! New way with databse

// Explanation : router.route('desiredRoute).get(middleware,mongoControllerMethod);
router
  .route("/top-5-cheap")
  .get(tourController_m.aliasTopTours, tourController_m.getAllTours);

router
  .route("/")
  .post(tourController_m.createTour)
  .get(tourController_m.getAllTours);

router
  .route("/:id")
  .get(tourController_m.getTour)
  .patch(tourController_m.updateTour)
  .delete(tourController_m.deleteTour);

module.exports = router;
