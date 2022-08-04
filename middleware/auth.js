// JWT based token authentication for all apis

var jwt = require("jsonwebtoken");

module.exports = (req, res, next) => {
  try {
    var token = req.headers.authorizarion.split(" ")[1];
    var decode = jwt.verify(token, "secret");
    req.userData = decode;
    next();
  } catch (error) {
    res.status(401).json({
      error: "Invalid Token",
    });
  }
  var token = req.body.token;
};
