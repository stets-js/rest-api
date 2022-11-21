const app = require("./app");
const mongoose = require("mongoose");
require("dotenv").config();

const startApp = async () => {
  try {
    await mongoose.connect(process.env.DB_URL);
    app.listen(process.env.PORT, () => {
      console.log("Database connection successful");
    });
  } catch (err) {
    console.log(err);
    process.exit(1);
  }
};

startApp();
