const express = require("express");
const multer = require("multer");
const path = require("path");
const {
  getAllTours,
  getTourById,
  createTour,
  updateTour,
  deleteTour,
} = require("../controllers/tourController");
const { protect } = require("../middlewares/auth");
const { allowAccessTo } = require("../middlewares/roleAccess");
const validate = require("../middlewares/validate");
const { validateTour, validateUpdatedTour } = require("../validators/tour");
const validatePagination = require("../validators/pagination");
const normalizeDates = require("../middlewares/normalizeDates");

const router = express.Router();

// Multer config
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, path.join(__dirname, "../uploads"));
  },
  filename: (req, file, cb) => {
    cb(null, Date.now() + "-" + file.originalname);
  },
});

const upload = multer({ storage });

router
  .route("/")
  .get(validatePagination, validate, getAllTours)
  .post(
    protect,
    allowAccessTo("admin"),
    upload.single("image"),
    normalizeDates,
    validateTour,
    validate,
    createTour
  );

router
  .route("/:tourId")
  .get(getTourById)
  .patch(
    protect,
    allowAccessTo("admin"),
    upload.single("image"),
    normalizeDates,
    validateUpdatedTour,
    validate,
    updateTour
  )
  .delete(protect, allowAccessTo("admin"), deleteTour);

module.exports = router;
