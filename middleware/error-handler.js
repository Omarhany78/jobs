const { StatusCodes } = require("http-status-codes");
const errorHandlerMiddleware = (err, req, res, next) => {
  let customError = {
    msg: err.message || "Something went wrong",
    statusCode: err.statusCode || StatusCodes.INTERNAL_SERVER_ERROR,
  };

  if (err.code && err.code === 11000) {
    customError.msg = `${err.keyValue.email} is taken, please try another one`;
    customError.statusCode = 400;
  }

  if (err.name === "ValidationError") {
    customError.msg = Object.values(err.errors)
      .map((item) => item.message)
      .join(",");
    customError.statusCode = 400;
  }

  if (err.name === "CastError") {
    customError.msg = `There is no job with id ${err.value}`;
  }

  // return res
  //   .status(StatusCodes.INTERNAL_SERVER_ERROR)
  //   .json({ err, src: "error testing" });
  return res
    .status(customError.statusCode)
    .json({ src: "error handler", msg: customError.msg });
};

module.exports = errorHandlerMiddleware;
