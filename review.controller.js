import createError from "../utils/createError.js";
import Review from "../models/review.model.js";
import Gig from "../models/gig.model.js";

// Create a new review
export const createReview = async (req, res, next) => {
  try {
    // Prevent sellers from posting reviews
    if (req.user.isSeller)
      return next(createError(403, "Sellers can't create a review!"));

    const { gigId, desc, star } = req.body;

    // Prevent duplicate reviews
    const existing = await Review.findOne({ gigId, userId: req.user.id });
    if (existing)
      return next(createError(403, "You have already reviewed this gig!"));

    const newReview = new Review({
      userId: req.user.id,
      gigId,
      desc,
      star,
    });

    const savedReview = await newReview.save();

    // Update Gig rating
    await Gig.findByIdAndUpdate(gigId, {
      $inc: { totalStars: star, starNumber: 1 },
    });

    // Populate user info for frontend
    await savedReview.populate("userId", "username img country");

    res.status(201).json(savedReview);
  } catch (err) {
    next(err);
  }
};

// Get all reviews for a gig
export const getReviews = async (req, res, next) => {
  try {
    const reviews = await Review.find({ gigId: req.params.gigId }).populate(
      "userId",
      "username img country"
    );
    res.status(200).json(reviews);
  } catch (err) {
    next(err);
  }
};
