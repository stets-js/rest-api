const mongoose = require("mongoose");

const Contact = new mongoose.Schema(
  {
    id: {
      type: String,
    },
    name: {
      type: String,
      minLength: 3,
      maxLength: 10,
      required: [true, "Set name for contact"],
    },
    email: {
      type: String,
      unique: true,
      required: true,
    },
    phone: {
      type: String,
      minLength: 3,
      maxLength: 15,
      required: true,
    },
    favorite: {
      type: Boolean,
      default: false,
    },
  },
  {
    versionKey: false,
  }
);

module.exports = mongoose.model("Contact", Contact);
