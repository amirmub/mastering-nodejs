const mongoose = require("mongoose");
const Review = require("./reviewModel");

const tourSchema = new mongoose.Schema({
   name: {
     type: String,
     required: [true, "Name must be included"],
     unique: true,
   },
  rating: {
    type: Number,
    default: 3.5,
  },
  price: {
    type: Number,
    required: [true, "Price must be included"],
  },
  discountPrice: {
    type: Number,
  },
  duration: {
    type: Number,
    required: [true, "duration must be included"],
  },
  maxGroupSize:{
    type : Number,
    required:true,
  },
  ratingsAverage:{
    type : Number,
    default : 4.5
  },
  ratingsQuantity:{
    type : Number,
    default : 0
  },
  difficulty:{
    type : String,
    required:[true, "difficulty must be included"],
  },
  summary:{
    type : String,
    trim : true,
  },
  description:{
    type : String,
    required:[true, "description must be included"],
    trim : true,
    
  },
  imageCover:{
    type : String,
    required:[true, "imageCover must be included"],
  },
  images: [String],
  // to get user details in guides array
  guides:[{
      type: mongoose.Schema.ObjectId,
      ref: "User",
  }],
  createdAt: {
    type: Date,
    default: Date.now()
  },
  startDate: [Date]
},
{ toJSON: { virtuals: true }, toObject: { virtuals: true } }
);

// Virtual populate (no manual array storing required)
tourSchema.virtual("review", {
  ref: "Review",
  foreignField: "tour",   // from Review model
  localField: "_id"       // matches Tour _id
});

const Tour = mongoose.model("Tour", tourSchema);

module.exports = Tour;
