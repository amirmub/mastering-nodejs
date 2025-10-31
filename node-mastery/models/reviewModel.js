const mongoose = require("mongoose");

const reviewSchema = new mongoose.Schema({
    review: {
        type: String,
        required: [true, "Review cannot be empty"],
    },
    rating: {
        type: Number,
        min: 1,
        max: 5,
        required: [true, "Rating must be included"],
    },  
    createdAt: {
        type: Date,
        default: Date.now,
    },
    user: {
        type: mongoose.Schema.ObjectId,
        ref: "User",
        required: [true, "Review must belong to a tour"],
    },
    tour: {
        type: mongoose.Schema.ObjectId,
        ref: "Tours",
        required: [true, "Review must belong to a tour"],
    },

})

const Review = mongoose.model("Review", reviewSchema);

module.exports = Review;
