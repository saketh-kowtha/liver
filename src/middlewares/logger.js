function logger(req, res, next) {
    const end = res.end;
    res.end = function (...args) {
      console.log(`${req.url} ${req.method} ${res.statusCode}`);
      res.end = end
      res.end(...args)
    };
    next();
  }

  module.exports = logger