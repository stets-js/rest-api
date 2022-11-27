const jwt = require("jsonwebtoken");
const User = require("../models/usersSchema");

const logout = async (req, res, next) => {
  const { authorization = "" } = req.headers;
  const [bearer, token] = authorization.split(" ");

  try {
    if (bearer !== "Bearer") {
      res.status(401).json({
        message: "Not authorized",
      });
    }
    const { _id } = jwt.verify(token, process.env.TOKEN_KEY);
    const user = await User.findById(_id);
    if (!user || !user.token) {
      res.status(401).json({
        message: "Not authorized",
      });
    }
    req.user = user;
    next();
  } catch (error) {
    if (error.message === "Invalid sugnature") {
      error.status = 401;
    }
    next(error);
  }
};

module.exports = logout;
