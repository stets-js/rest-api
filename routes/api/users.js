const UsersController = require("../../models/usersController.js");
const logoutMiddleware = require("../../middlewares/logoutMiddleware");
const express = require("express");
const router = express.Router();

router.post("/register", UsersController.create);
router.post("/login", UsersController.login);
router.post("/logout", logoutMiddleware, UsersController.logout);
router.get("/current", logoutMiddleware, UsersController.getCurrent);

module.exports = router;
