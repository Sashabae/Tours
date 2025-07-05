const express = require("express");
const {
  createReview,
  getReviewsByUserId,
  getReviewsByTourId,
  deleteReview,
} = require("../controllers/reviewController");
const { protect } = require("../middlewares/auth");
const validate = require("../middlewares/validate");
const validateReview = require("../validators/review");

const router = express.Router();

router
  .route("/tour/:tourId")
  .get(getReviewsByTourId)
  .post(protect, validateReview, validate, createReview);

router.route("/user/:userId").get(protect, getReviewsByUserId);

router.route("/:reviewId").delete(protect, deleteReview);

module.exports = router;
