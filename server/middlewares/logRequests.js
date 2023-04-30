const logRequests = (req, res, next) => {
  console.log("....................................");
  console.log(req.originalUrl);
  next();
};

module.exports = { logRequests };
