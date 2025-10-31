const express = require("express");
const router = express();
const reviewController = require("../controllers/reviewController")
const authMiddleware = require("../middleware/authMiddleware");

// routes to create reviews
router.post("/reviews",[authMiddleware.tokenVerify, authMiddleware.isAdmin],reviewController.createReview);

// routes to get all reviews
router.get("/reviews",[authMiddleware.tokenVerify, authMiddleware.isAdmin],reviewController.getAllReview);

// routes to get single reviews
router.get("/reviews/:id",[authMiddleware.tokenVerify, authMiddleware.isAdmin],reviewController.getReview);

// routes to update reviews
router.put("/reviews/:id",[authMiddleware.tokenVerify, authMiddleware.isAdmin],reviewController.updateReview);

// routes to delete reviews
router.delete("/reviews/:id",[authMiddleware.tokenVerify, authMiddleware.isAdmin],reviewController.deleteReview);

module.exports = router
