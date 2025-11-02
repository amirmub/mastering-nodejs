const express = require("express");
const router = express.Router({mergeParams: true});// for merging or nested array
const reviewController = require("../controllers/reviewController")
const authMiddleware = require("../middleware/authMiddleware");

router.use(authMiddleware.tokenVerify,authMiddleware.isAdmin)

// routes to create reviews
router.post("/reviews",reviewController.createReview);

// routes to get all reviews
router.get("/reviews",reviewController.getAllReview);

// routes to get single reviews
router.get("/reviews/:id",reviewController.getReview);

// routes to update reviews
router.put("/reviews/:id",reviewController.updateReview);

// routes to delete reviews
router.delete("/reviews/:id",reviewController.deleteReview);

module.exports = router
