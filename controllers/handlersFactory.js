const catchAsyncErrors = require('../utils/catchAsyncErrors');

exports.deleteOne = (model) =>
  catchAsyncErrors(async (req, res, next) => {
    console.log(req.params.id);
    const document = await model.findByIdAndDelete(req.params.id);
    console.log(document);

    res.status(204).json({
      status: 'success',
      message: 'User successfully deleted',
      data: { document },
    });
  });
