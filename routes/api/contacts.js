const {
  listContacts,
  getContactById,
  removeContact,
  addContact,
  updateContact,
} = require("../../models/contacts");
const express = require("express");
const router = express.Router();

router.get("/", async (req, res, next) => {
  res.json(await listContacts());
});

router.get("/:contactId", async (req, res, next) => {
  res.json(await getContactById(req.params.contactId));
});

router.post("/", async (req, res, next) => {
  const { name, email, phone } = req.query;
  res.json(await addContact({ name, email, phone }));
});

router.delete("/:contactId", async (req, res, next) => {
  res.json(await removeContact(req.params.contactId));
});

router.put("/:contactId", async (req, res, next) => {
  res.json({ message: "template message" });
});

module.exports = router;
