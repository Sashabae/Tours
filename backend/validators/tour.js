const { body } = require("express-validator");
const { validateDate, validateUpdatedDate } = require("./date");

const validateTour = [
  body("name")
    .notEmpty()
    .withMessage("Name is required")
    .isLength({ min: 3 })
    .withMessage("Name must be at least 3 characters long")
    .isLength({ max: 50 })
    .withMessage("Name must be at most 50 characters long"),

  body("description")
    .notEmpty()
    .withMessage("Description is required")
    .isLength({ min: 10 })
    .withMessage("Description must be at least 10 characters long")
    .isLength({ max: 500 })
    .withMessage("Description must be at most 500 characters long"),

  body("price")
    .notEmpty()
    .withMessage("Price is required")
    .isNumeric()
    .withMessage("Price must be a number"),

  body("category")
    .notEmpty()
    .withMessage("Category is required")
    .isIn(["individual", "group"])
    .withMessage("Category must be 'individual' or 'group'"),

  body("duration")
    .notEmpty()
    .withMessage("Duration is required")
    .isNumeric()
    .withMessage("Duration must be a number")
    .isInt({ min: 1 })
    .withMessage("Duration must be a positive integer"),

  // Including date validator
  ...validateDate,
];

// Everything optional for PATCH method
const validateUpdatedTour = [
  body("name")
    .optional()
    .isLength({ min: 3 })
    .withMessage("Name must be at least 3 characters long")
    .isLength({ max: 50 })
    .withMessage("Name must be at most 50 characters long"),

  body("description")
    .optional()
    .isLength({ min: 10 })
    .withMessage("Description must be at least 10 characters long")
    .isLength({ max: 500 })
    .withMessage("Description must be at most 500 characters long"),

  body("price").optional().isNumeric().withMessage("Price must be a number"),

  body("category")
    .optional()
    .isIn(["individual", "group"])
    .withMessage("Category must be 'individual' or 'group'"),

  body("duration")
    .optional()
    .isNumeric()
    .withMessage("Duration must be a number")
    .isInt({ min: 1 })
    .withMessage("Duration must be a positive integer"),

  // Including updated date validator
  ...validateUpdatedDate,
];

module.exports = { validateTour, validateUpdatedTour };
