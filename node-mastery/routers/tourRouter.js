const express = require("express");
const router = express();
const tourController = require("../controllers/tourController")

// routes to Create tours
router.post("/tours",tourController.createTour);

// routes to get all tours
router.get("/tours",tourController.getAllTour);

// routes to get single tour

// routes to update tour
router.put("/tours/:id",tourController.updateTour);

// routes to delete tour
router.delete("/tours/:id",tourController.deleteTour);

module.exports = router
router.get("/tours/:id",tourController.getTour);
