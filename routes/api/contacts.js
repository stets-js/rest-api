const {
  listContacts,
  getById,
  removeContact,
  addContact,
  updateContact,
} = require("../../models/contacts");
const express = require("express");
const router = express.Router();
const validation = require("../../models/validation");

router.get("/", async (req, res, next) => {
  res.status(200).json(await listContacts());
});

router.get("/:contactId", async (req, res, next) => {
  if ((await getById(req.params.id)) === null) {
    res.status(404).json({ message: "Not found" });
  }
  res.status(200).json(await getById(req.params.contactId));
});

router.post("/", async (req, res, next) => {
  const { name, email, phone } = req.query;
  if (name === undefined || email === undefined || phone === undefined) {
    res.status(400).json({ message: "missing required name field" });
  }
  try {
    const validatedData = await validation.validateAsync({
      name,
      email,
      phone,
    });

    res.status(201).json(await addContact(validatedData));
  } catch (err) {
    res.status(404).json({ message: err });
  }
});

router.delete("/:contactId", async (req, res, next) => {
  if ((await getById(req.params.id)) === null) {
    res.status(404).json({ message: "Not found" });
  }
  await removeContact(req.params.contactId);
  res.status(200).json({ message: "contact deleted" });
});

router.put("/:contactId", async (req, res, next) => {
  const { name, email, phone } = req.query;
  const id = req.params.contactId;
  if (name === undefined || email === undefined || phone === undefined) {
    res.status(400).json({ message: "missing fields" });
  }
  try {
    const validatedData = await validation.validateAsync({
      name,
      email,
      phone,
    });
    const updatedContact = await updateContact(id, validatedData);
    if (updatedContact) {
      res.status(200).json(updatedContact);
    }
    res.status(404).json({ message: "Not found" });
  } catch (err) {
    res.status(404).json({ message: err });
  }
});

module.exports = router;
