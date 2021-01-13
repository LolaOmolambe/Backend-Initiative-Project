exports.createOne = (Model) => async (req, res, next) => {
  try {
    let result = await Model.create(req.body);

    // if (!result) {
    //   //throw error
    //   console.log("Failed");
    // }

    res.status(200).json({
      status: "Success",
      data: {
        result,
      },
    });
    return result;
  } catch (err) {
    res.status(500).json({
      status: "Error",
      message: "Oops, Something went wrong",
    });
  }
};

exports.getAll = (Model) => async (req, res, next) => {
  try {
    const result = await Model.find();
    res.status(200).json({
      status: "Success",
      data: {
        result,
      },
    });
  } catch (err) {
    res.status(500).json({
      status: "Error",
      message: "Oops, Something went wrong",
    });
  }
};

exports.getOne = (Model) => async (req, res, next) => {
  try {
    let result = await Model.findById(req.params.id);

    if (!result) {
      res.status(404).json({
        status: "Error",
        message: `No document exists with this ID ${req.params.id}`,
      });
    }
    res.status(200).json({
      status: "Success",
      data: {
        result,
      },
    });
  } catch (err) {
    res.status(500).json({
      status: "Error",
      message: "Oops, Something went wrong",
    });
  }
};

exports.updateOne = (Model) => async (req, res, next) => {
  try {
    let result = await Model.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
      runValidators: true,
    });

    if (!result) {
      //throw error
      res.status(404).json({
        status: "Error",
        message: `No document exists with this ID ${req.params.id}`,
      });
    }
    res.status(200).json({
      status: "Success",
      data: {
        result,
      },
    });
  } catch (err) {
    res.status(500).json({
      status: "Error",
      message: "Oops, Something went wrong",
    });
  }
};

exports.deleteOne = (Model) => async (req, res, next) => {
  try {
    let result = await Model.findByIdAndUpdate(req.params.id, {
      isDeleted: true,
    });
    if (!result) {
      res.status(404).json({
        status: "Error",
        message: `No document exists with this ID ${req.params.id}`,
      });
    }
    res.status(200).json({
      status: "Success",
      data: null,
    });
  } catch (err) {
    res.status(500).json({
      status: "Error",
      message: "Oops, Something went wrong",
    });
  }
};
