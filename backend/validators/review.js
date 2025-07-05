const { body, param } = require("express-validator");

const validateReview = [
  param("tourId")
    .exists()
    .withMessage("Tour ID is required")
    .isInt({ min: 1 })
    .withMessage("Tour ID must be a positive integer"),

  body("rating")
    .notEmpty()
    .withMessage("Rating is required")
    .isInt({ min: 1, max: 5 })
    .withMessage("Rating must be a number between 1 and 5"),

  body("comment")
    .optional()
    .isLength({ max: 500 })
    .withMessage("Comment should not exceed 500 characters"),
];

module.exports = validateReview;
