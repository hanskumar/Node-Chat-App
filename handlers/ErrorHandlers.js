/*
  Catch Errors Handler
*/

exports.catchErrors = (fn) => {
    return function (req, res, next) {
      fn(req, res, next).catch((err) => {
        //Validation Errors
        if (typeof err === "string") {
          res.status(400).json({
            message: err,
          });
        } else {
          next(err);
        }
      });
    };
  };