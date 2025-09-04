const mongoose = require("mongoose");

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
    require: true,
  },
  Date: {
    type: Date,
    default: Date.now()
  }
});

const Tour = mongoose.model("Tours", tourSchema);

module.exports = Tour;