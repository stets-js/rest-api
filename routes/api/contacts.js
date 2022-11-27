const ContactController = require("../../models/contactController.js");
const { authMiddleware } = require("../../middlewares/authMiddleware.js");
const express = require("express");
const router = express.Router();

router.use(authMiddleware);

router.get("/", ContactController.getAll);

router.get("/:contactId", ContactController.getOne);

router.post("/", ContactController.create);

router.delete("/:contactId", ContactController.delete);

router.put("/:contactId", ContactController.update);

router.patch("/:contactId/favorite", ContactController.favorite);

module.exports = router;
