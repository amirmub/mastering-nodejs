const Tour = require("../models/tourModel");

// to create a tour
async function createTour(req,res) {
    const {name, rating, price,discountPrice, duration, maxGroupSize, difficulty, description, imageCover, images, startDate, guides} = req.body;

    if (discountPrice > price) {
      return res.status(400).json({status : "fail", msg : "the price must be greatethan discountPrice"})
    }

   try {
     const newTour = await Tour.create({
        name, rating, price,discountPrice, duration, maxGroupSize, difficulty, description, imageCover, images, startDate,guides
    });

     res.status(201).json({
        status : "success",
        msg : `successfully added`,
        data: newTour
    });

   } catch (error) {
    console.log(error);
    
    return res.status(500).json({ 
        msg: "Internal server error", error : error.message
    });
   }

}

// to get all tours
async function getAllTour(req, res) {
 try {
    const allTours =  await Tour.find({});
    return res.status(200).json({ 
       total : allTours.length, status: "success", msg : allTours
    });
  } catch (error) {
    return res.status(500).json({ 
        error : error,
        msg: "Internal server error" 
    });
  }
};

// to get a single tour
async function getTour(req, res) {
  try { 
    const tour = await Tour.findById(req.params.id);

    if (!tour) {
      return res.status(404).json({ status: "fail", message: "Invalid ID" });
    }

    res.status(200).json({ status: "success", msg: tour });
  } catch (error) {
    console.log(error)
    return res.status(500).json({ msg: "Internal server error" });
  }
}

//  to update a tour
async function updateTour (req, res) {
    try {
    const { name, price, rating } = req.body;
    const tour = await Tour.findById(req.params.id);

    if (!tour) {
      return res.status(404).json({ status : "fail", msg: "tour not found" });
    }

    tour.name = name || tour.name;
    tour.price = price || tour.price;
    tour.rating = rating || tour.rating;

    await tour.save();
    return res.status(200).json({ status : "success", msg: "Tour updated successfully" });
  } catch (error) {
    console.log(error);
    return res.status(500).json({ msg: "Internal server error"});
  }
};

//  to delete a tour
async function deleteTour(req, res) {
   try {
    const tour = await Tour.findById(req.params.id);
    if (!tour) {
        return res.status(404).json({ status : "fail", message: "tour not found"});
    }

    await tour.deleteOne();
    return res.status(200).json({ status : "success", message: "tour deleted successfully", data: null });

   } catch (error) {
    console.log(error);
    return res.status(500).json({ msg: "Internal server error"});
   }
};

module.exports = { createTour, getAllTour, getTour, updateTour, deleteTour}
