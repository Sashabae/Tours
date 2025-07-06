const {
  getAllTours,
  getTourById,
  createTour,
  updateTour,
  deleteTour,
} = require("../models/tourModel");
const AppError = require("../utils/appError");

// GET ALL
exports.getAllTours = async (req, res, next) => {
  try {
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 10;
    const offset = (page - 1) * limit;

    const { category, search, date } = req.query;

    if (isNaN(page) || isNaN(limit)) {
      throw new AppError("Page and limit must be numbers", 400);
    }

    const { tours, totalCount } = await getAllTours({
      limit,
      offset,
      category,
      search,
      date,
    });

    const totalPages = Math.ceil(totalCount / limit);

    res.status(200).json({
      status: "success",
      data: tours,
      pagination: {
        totalItems: totalCount,
        totalPages,
        currentPage: page,
        perPage: limit,
      },
    });
  } catch (error) {
    next(error);
  }
};

// GET BY ID
exports.getTourById = async (req, res, next) => {
  try {
    const { tourId } = req.params;

    const tour = await getTourById(tourId);

    if (!tour) {
      throw new AppError("Tour not found", 404);
    }

    res.status(200).json({
      status: "success",
      data: tour,
    });
  } catch (error) {
    next(error);
  }
};

// POST
exports.createTour = async (req, res, next) => {
  try {
    const newTour = req.body;

    // multer puts the uploaded file info in req.file
    if (req.file) {
      // Save the relative path to the image in the tour object
      newTour.image = req.file.filename;
    }
    if (!newTour.image) {
      throw new AppError("Image is required", 400);
    }

    if (
      !newTour ||
      !newTour.name ||
      !newTour.description ||
      !newTour.price ||
      !newTour.category ||
      !newTour.duration ||
      !newTour.dates
    ) {
      throw new AppError("Missing required fields", 400);
    }

    const createdTour = await createTour(newTour, newTour.dates);

    res.status(201).json({
      status: "success",
      data: createdTour,
    });
  } catch (error) {
    next(error);
  }
};

// UPDATE (PATCH)
exports.updateTour = async (req, res, next) => {
  try {
    const { tourId } = req.params;
    const updatedTour = req.body;

    const updated = await updateTour(tourId, updatedTour);

    if (!updated) {
      throw new AppError("Tour not found", 404);
    }

    res.status(200).json({
      status: "success",
      data: updated,
    });
  } catch (error) {
    next(error);
  }
};

// DELETE
exports.deleteTour = async (req, res, next) => {
  try {
    const { tourId } = req.params;

    const deleted = await deleteTour(tourId);

    if (!deleted) {
      throw new AppError("Tour not found", 404);
    }

    res.sendStatus(204);
  } catch (error) {
    next(error);
  }
};
