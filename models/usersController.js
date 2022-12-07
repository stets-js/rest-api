// const isValid = require("mongoose").isValidObjectId;
const bcrypt = require("bcrypt");
const { v4: uuidv4 } = require("uuid");
const token = require("jsonwebtoken");
const User = require("./usersSchema.js");
const joi = require("./validation.js");
const path = require("path");
const fs = require("fs/promises");
const Jimp = require("jimp");
const sgMail = require("@sendgrid/mail");
require("dotenv").config();

class UsersController {
  async create(req, res) {
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
    const verificationToken = uuidv4();
    const user = new User({ email, password, verificationToken });
    await user.save();

    sgMail.setApiKey(process.env.SENDGRID_API_KEY);
    const msg = {
      to: email,
      from: `${process.env.SEND_FROM}`,
      subject: "Verify your account!",
      text: "Thank you for using our Node.js application",
      html: `<a target="_blank" href="${process.env.HOST}/users/verify/${verificationToken}">Please, verify you email</a>`,
    };
    await sgMail
      .send(msg)
      .then(() => {
        console.log("Email sent");
      })
      .catch((error) => {
        console.error(error);
      });

    res.status(201).json({
      user: {
        email: email,
        subscription: "starter",
        verificationToken: verificationToken,
      },
    });
  }

  async login(req, res) {
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
    if (!user.verify) {
      res.status(401).json({
        message: "Verify your account",
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

  async logout(req, res) {
    const { _id } = req.user;
    await User.findByIdAndUpdate(_id, { token: null });
    res.status(204).json({ message: "No Content" });
  }

  async getCurrent(req, res) {
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

  async setAvatar(req, res) {
    const avatarsDir = path.join(__dirname, "../", "public", "avatars");
    const { path: tmpUpload, originalname } = req.file;
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

  async verificateEmail(req, res) {
    const { verificationToken } = req.params;
    const user = await User.findOne({ verificationToken });
    if (!user) {
      res.status(404).json({
        message: "User not found",
      });
    }
    await User.findByIdAndUpdate(user._id, {
      verify: true,
      verificationToken: null,
    });

    res.status(200).json({
      message: "Verification successful",
    });
  }

  async verificateEmailResend(req, res) {
    const { email } = req.body;
    if (!email) {
      res.status(400).json({ message: "missing required field email" });
    }
    const user = await User.findOne({ email });

    if (!user) {
      res.status(404).json({
        message: "User not found",
      });
    }

    if (user.verify) {
      throw new Error("Verification has already been passed");
    }
    const verificationToken = user.verificationToken;
    const msg = {
      to: email,
      from: `${process.env.SEND_FROM}`,
      subject: "Verify your account!",
      text: "Thank you for using our Node.js application",
      html: `<a target="_blank" href="${process.env.HOST}/users/verify/${verificationToken}">Please, verify you email</a>`,
    };
    await sgMail
      .send(msg)
      .then(() => {
        console.log("Email sent");
      })
      .catch((error) => {
        console.error(error);
      });
    res.status(200).json({ message: "Verification email sent" });
  }
}

module.exports = new UsersController();
