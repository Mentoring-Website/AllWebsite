const jwt = require("jsonwebtoken");
const createError = require("../utils/createError");

const auth = (req, res, next) => {

  const token = req.cookies.accessToken;

  if (!token) return next(createError(401, "You are not authenticated!"));

  jwt.verify(token, "secretKey", (err, user) => {
    if (err) return next(createError(403, "Token is not valid!"));
    req.user = user;
    next();
  });
};
module.exports = auth;
