const { successResponse } = require("../utils/response");
const AppError = require("../errors/appError");
const { clearKey } = require("../utils/cache");
const QueryHelper = require("../utils/queryHelper");

/**
 * Controller to create a record in a Model
 * @param {*} Model - Mongoose model to query
 * @returns
 */
exports.createOne = (Model) => async (req, res, next) => {
  try {
    let result = await Model.create(req.body);

    // if (!result) {
    //   //throw error
    //   console.log("Failed");
    // }
    clearKey(Model.collection.collectionName);
    return successResponse(res, 200, "Creation successfull", { result });
  } catch (err) {
    next(err);
  }
};

/**
 * Controller to get multiple records from a Model
 * @param {*} Model - Mongoose model to query
 * @returns
 */
exports.getAll = (Model) => async (req, res, next) => {
  try {
    let filter = {};
    if (
      Model.collection.collectionName == "bookings" &&
      req.user.role != "admin"
    ) {
      filter._userId = req.user._id;
    }
    let resultQuery = new QueryHelper(Model.find(filter), req.query)
      .filter()
      .sort()
      .paginate();
    let result = await resultQuery.query.cache();

    return successResponse(res, 200, "Data fetched sucessfully", { result });
  } catch (err) {
    next(err);
  }
};

/**
 * Controller to get a single record from a Model
 * @param {*} Model - Mongoose model to query
 * @returns
 */
exports.getOne = (Model) => async (req, res, next) => {
  try {
    let result;
    if (
      Model.collection.collectionName == "bookings" &&
      req.user.role != "admin"
    ) {
      result = await Model.find({
        _id: req.params.id,
        _userId: req.user._id,
      });
    } else {
      result = await Model.find({
        _id: req.params.id,
      });
    }

    if (!result) {
      return next(
        new AppError(`No document exists with this ID ${req.params.id}`, 404)
      );
    }
    return successResponse(res, 200, "Data fetched successfully", { result });
  } catch (err) {
    next(err);
  }
};

/**
 * Controller to update a record in a Model
 * @param {*} Model - Mongoose model to query
 * @returns
 */
exports.updateOne = (Model) => async (req, res, next) => {
  try {
    let result;
    if (Model.collection.collectionName == "bookings") {
      result = await Model.findOneAndUpdate(
        {
          _id: req.params.id,
          _userId: req.user._id,
        },
        req.body,
        {
          new: true,
          runValidators: true,
        }
      );
    } else {
      result = await Model.findOneAndUpdate(
        {
          _id: req.params.id,
        },
        req.body,
        {
          new: true,
          runValidators: true,
        }
      );
    }

    if (!result) {
      return next(
        new AppError(
          `No document exists with this ID ${req.params.id} for ${req.user.name}`,
          404
        )
      );
    }

    return successResponse(res, 200, "Update successfull", { result });
  } catch (err) {
    next(err);
  }
};

/**
 * Controller to delete a single record from a Model
 * @param {*} Model - Mongoose model to query
 * @returns
 */
exports.deleteOne = (Model) => async (req, res, next) => {
  try {
    let result;

    if (
      Model.collection.collectionName == "bookings" &&
      req.user.role != "admin"
    ) {
      result = await Model.findOneAndUpdate(
        {
          _id: req.params.id,
          _userId: req.user._id,
        },
        {
          isDeleted: true,
        }
      );
    } else {
      result = await Model.findOneAndUpdate(
        {
          _id: req.params.id,
        },
        {
          isDeleted: true,
        }
      );
    }

    if (!result) {
      return next(
        new AppError(`No document exists with this ID ${req.params.id}`, 401)
      );
    }
    return successResponse(res, 200, "Deletion Successfull", null);
  } catch (err) {
    next(err);
  }
};
