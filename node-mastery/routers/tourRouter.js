const express = require("express");
const router = express.Router();
const tourController = require("../controllers/tourController");
const reviewController = require("../controllers/reviewController");
const authMiddleware = require("../middleware/authMiddleware");

// Nested review route use middleware to get user information
router.post("/tours/:tourId/reviews", authMiddleware.tokenVerify, reviewController.createReview);

//  Create tour
router.post("/tours", tourController.createTour);

// routes to get all tours
router.get("/tours",tourController.getAllTour);

// routes to get single tour
router.get("/tours/:id",tourController.getTour);

// routes to update tour
router.put("/tours/:id",tourController.updateTour);

// routes to delete tour
router.delete("/tours/:id",tourController.deleteTour);

module.exports = router
