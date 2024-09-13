const User = require("../models/User");
const jwt = require("jsonwebtoken");
const { UnauthenticatedError } = require("../errors");

const auth = async (req, res, next) => {
  const authorization = req.headers.authorization;

  if (!authorization || !authorization.startsWith("Bearer ")) {
    throw new UnauthenticatedError("Please provide a token");
  }

  const token = authorization.split(" ")[1];

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    req.user = { userId: decoded.id, name: decoded.name };
    next();
  } catch (error) {
    throw new UnauthenticatedError("Please provide a valid token");
  }
};

module.exports = auth;
