const jwt = require("jsonwebtoken");
const User = require("../models/usersSchema.js");

const authMiddleware = async (req, res, next) => {
  const [tokenType, token] = req.headers["authorization"].split(" ");
  const user = jwt.decode(token, process.env.TOKEN_KEY);
  const id = user._id;
  if (!token) {
    res.status(401).json({
      message: "Not authorized",
    });
  } else if (token !== user.token) {
    res.status(401).json({
      message: "Not authorized",
    });
  }
  try {
    if (!(await User.findOne({ id }))) {
      res.status(401).json({
        message: "Not authorized",
      });
    }
    req.token = token;
    req.user = user;
    next();
  } catch (error) {
    res.status(400).json({
      message: error.message,
    });
  }
};

module.exports = {
  authMiddleware,
};
