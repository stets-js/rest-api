const UsersController = require("../../models/usersController.js");
const logoutMiddleware = require("../../middlewares/logoutMiddleware");
const upload = require("../../middlewares/setAvatarMiddleware");
const express = require("express");
const router = express.Router();

router.post("/register", UsersController.create);
router.post("/login", UsersController.login);
router.post("/logout", logoutMiddleware, UsersController.logout);
router.get("/current", logoutMiddleware, UsersController.getCurrent);
router.patch(
  "/avatar",
  logoutMiddleware,
  upload.single("avatar"),
  UsersController.setAvatar
);
router.get("/verify/:verificationToken", UsersController.verificateEmail);

module.exports = router;
