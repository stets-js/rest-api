const UsersController = require("../../models/usersController.js");
const express = require("express");
const router = express.Router();

router.post("/", UsersController.create);

module.exports = router;
