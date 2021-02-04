exports.createOne = (Model) => async (req, res, next) => {
  try {
    let result = await Model.create(req.body);

    // if (!result) {
    //   //throw error
    //   console.log("Failed");
    // }

    res.status(200).json({
      status: "success",
      data: {
        result,
      },
    });
    return result;
  } catch (err) {
    res.status(500).json({
      status: "error",
      message: "Oops, Something went wrong",
    });
  }
};

exports.getAll = (Model) => async (req, res, next) => {
  try {
    let result;
    if (Model.collection.collectionName == "bookings") {
      result = await Model.find({ _userId: req.user._id });
    } else {
      result = await Model.find({});
    }

    return res.status(200).json({
      status: "success",
      data: {
        result,
      },
    });
  } catch (err) {
    res.status(500).json({
      status: "error",
      message: "Oops, Something went wrong",
    });
  }
};

exports.getOne = (Model) => async (req, res, next) => {
  try {
    let result;
    if (Model.collection.collectionName == "bookings") {
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
      return res.status(404).json({
        status: "error",
        message: `No document exists with this ID ${req.params.id}`,
      });
    }
    res.status(200).json({
      status: "success",
      data: {
        result,
      },
    });
  } catch (err) {
    console.log("err ", err);
    res.status(500).json({
      status: "error",
      message: "Oops, Something went wrong",
    });
  }
};

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
      //throw error
      return res.status(404).json({
        status: "error",
        message: `No document exists with this ID ${req.params.id} for ${req.user.name}`,
      });
    }
    res.status(200).json({
      status: "success",
      data: {
        result,
      },
    });
  } catch (err) {
    res.status(500).json({
      status: "error",
      message: "Oops, Something went wrong",
    });
  }
};

exports.deleteOne = (Model) => async (req, res, next) => {
  try {
    let result;

    if (Model.collection.collectionName == "bookings") {
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
      return res.status(404).json({
        status: "Error",
        message: `No document exists with this ID ${req.params.id}`,
      });
    }
    res.status(200).json({
      status: "success",
      data: null,
    });
  } catch (err) {
    res.status(500).json({
      status: "error",
      message: "Oops, Something went wrong",
    });
  }
};
