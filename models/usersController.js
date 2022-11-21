// const isValid = require("mongoose").isValidObjectId;
const User = require("./usersSchema.js");

class UsersController {
  async create(req, res, next) {
    const { email, password } = req.body;
    const user = new User({ email, password });
    await user.save();
    res.status(201).json({
      user: {
        email: email,
        subscription: "starter",
      },
    });
  }
}

module.exports = new UsersController();
