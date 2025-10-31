const Review = require("../models/reviewModel");

// to create a review
async function createReview(req,res) {
    const {review, rating, tour, user} = req.body;

   try {
     const newReview = await Review.create({
        review, rating, tour, user
    });

     res.status(201).json({
        status : "success",
        msg : `successfully added`,
        data: newReview
    });

   } catch (error) {
    console.log(error);
    
    return res.status(500).json({ 
        msg: "Internal server error", error : error.message
    });
   }

}

// to get all reviews
async function getAllReview(req, res) {
 try {
    const allReviews =  await Review.find({});
    return res.status(200).json({ 
       total : allReviews.length, status: "success", msg : allReviews
    });
  } catch (error) {
    return res.status(500).json({ 
        error : error,
        msg: "Internal server error" 
    });
  }
};

// to get a single tour
async function getReview(req, res) {
  try { 
    const review = await Review.findById(req.params.id).populate("user").populate("tour");

    if (!review) {
      return res.status(404).json({ status: "fail", message: "Invalid ID" });
    }

    res.status(200).json({ status: "success", msg: review });
  } catch (error) {
    console.log(error)
    return res.status(500).json({ msg: "Internal server error" });
  }
}

//  to update a review
async function updateReview (req, res) {
    try {
    const { review, rating } = req.body;
    const updatedReview = await Review.findById(req.params.id);

    if (!updatedReview) {
      return res.status(404).json({ status : "fail", msg: "review not found" });
    }

    updatedReview.review = review || updatedReview.review;
    updatedReview.rating = rating || updatedReview.rating;

    await updatedReview.save();
    return res.status(200).json({ status : "success", msg: "Review updated successfully" });
  } catch (error) {
    console.log(error);
    return res.status(500).json({ msg: "Internal server error"});
  }
};

//  to delete a review
async function deleteReview(req, res) {
   try {
    const review = await Review.findById(req.params.id);
    if (!review) {
        return res.status(404).json({ status : "fail", message: "review not found"});
    }

    await review.deleteOne();
    return res.status(200).json({ status : "success", message: "review deleted successfully", data: null });

   } catch (error) {
    console.log(error);
    return res.status(500).json({ msg: "Internal server error"});
   }
};

module.exports = { createReview, getAllReview, getReview, updateReview, deleteReview }
