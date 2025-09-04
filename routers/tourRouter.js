const express = require("express");
const router = express();
const tourController = require("../controllers/tourController")

// routes to get all tours
router.post("/api/v1/tours",tourController.createTour);

// routes to get all tours
router.get("/api/v1/tours",tourController.getAllTour);

// routes to get single tour
router.get("/api/v1/tours/:id",tourController.getTour);

// routes to update tour
router.put("/api/v1/tours/:id",tourController.updateTour);

// routes to delete tour
router.delete("/api/v1/tours/:id",tourController.deleteTour);

module.exports = router
