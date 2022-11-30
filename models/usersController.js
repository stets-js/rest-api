// const isValid = require("mongoose").isValidObjectId;
const bcrypt = require("bcrypt");
const token = require("jsonwebtoken");
const User = require("./usersSchema.js");
const joi = require("./validation.js");
const path = require("path");
const fs = require("fs/promises");
const Jimp = require("jimp");

class UsersController {
  async create(req, res, next) {
    const { email, password } = req.body;
    const isUserAdded = await User.findOne({ email });
    try {
      const body = await joi.validate({
        email: email,
        password: password,
      });
      if (body.error != null) {
        res.status(400).json({ message: "Enter correct email or password" });
        return;
      }
    } catch (err) {
      console.log(err);
    }

    if (isUserAdded) {
      res.status(409).json({
        message: "Email in use",
      });
      return;
    }
    const user = new User({ email, password });
    await user.save();
    res.status(201).json({
      user: {
        email: email,
        subscription: "starter",
      },
    });
  }

  async login(req, res, next) {
    const { email, password } = req.body;
    try {
      const body = await joi.validate({
        email: email,
        password: password,
      });
      if (body.error != null) {
        res.status(400).json({ message: "Enter correct email or password" });
        return;
      }
    } catch (err) {
      console.log(err);
    }
    const user = await User.findOne({ email });
    if (!user) {
      res.status(401).json({
        message: "Email or password is wrong",
      });
      return;
    }
    if (!(await bcrypt.compare(password, user.password))) {
      res.status(401).json({
        message: "Email or password is wrong",
      });
      return;
    }
    const userToken = token.sign(
      {
        _id: user._id,
      },
      process.env.TOKEN_KEY
    );

    await User.findByIdAndUpdate(user._id, { token: userToken });
    res.status(200).json({
      token: userToken,
      user: {
        email: user.email,
        subscription: user.subscription,
      },
    });
  }

  async logout(req, res, next) {
    const { _id } = req.user;
    await User.findByIdAndUpdate(_id, { token: null });
    res.status(204).json({ message: "No Content" });
  }

  async getCurrent(req, res, next) {
    try {
      const { _id } = req.user;
      const user = await User.findById(_id);
      res.status(200).json({
        user: {
          email: user.email,
          subscription: user.subscription,
        },
      });
    } catch (err) {
      console.log(err);
    }
  }

  async setAvatar(req, res, next) {
    const avatarsDir = path.join(__dirname, "../../", "public", "avatars");
    const { path: tmpUpload, originalname } = req.file;
    console.log(req.file);
    const { _id: id } = req.user;
    const imageName = `${id}_${originalname}`;
    try {
      await Jimp.read(tmpUpload).then((image) => {
        return image.resize(250, 250).write(tmpUpload);
      });
      const resultUpload = path.join(avatarsDir, imageName);
      await fs.rename(tmpUpload, resultUpload);
      const avatarUrl = path.join("public", "avatars", imageName);
      await User.findByIdAndUpdate(req.user._id, { avatarUrl });

      res.json({ avatarUrl });
    } catch (err) {
      console.log(err);
    }
  }
}

module.exports = new UsersController();
