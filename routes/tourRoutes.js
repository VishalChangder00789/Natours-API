const express = require("express");
const tourController = require("../controllers/tourController");
const router = express.Router();

// val is the id or paramter which is passed in the url
router.param("id", tourController.checkId);

router
  .route("/")
  .get(tourController.getAllTours)
  .post(tourController.checkBody, tourController.postTour);
router
  .route("/:id")
  .get(tourController.getTour)
  .patch(tourController.updateTour)
  .delete(tourController.deleteTour);

module.exports = router;
