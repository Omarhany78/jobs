const User = require("../models/User");
const { StatusCodes } = require("http-status-codes");
const { BadRequestError, UnauthenticatedError } = require("../errors");
const jwt = require("jsonwebtoken");

const register = async (req, res) => {
  const user = await User.create(req.body);
  const token = user.createJWT();
  res.status(StatusCodes.CREATED).json({ user: { name: user.name }, token });
};

const login = async (req, res) => {
  const { email, password } = req.body;
  if (!email || !password) {
    throw new BadRequestError("Please provide email and password");
  }

  const user = await User.findOne({ email });
  if (!user) {
    throw new UnauthenticatedError("Wrong email provided");
  }

  const isPasswordRight = await user.checkPassword(password);
  if (!isPasswordRight) {
    throw new UnauthenticatedError("Wrong password provided");
  }

  const token = user.createJWT();

  res.status(StatusCodes.OK).json({ name: user.name, token });
};

const getAllUser = async (req, res) => {
  const users = await User.find({});
  res.status(StatusCodes.OK).json({ length: Array.from(users).length, users });
};

module.exports = {
  register,
  login,
  getAllUser,
};
