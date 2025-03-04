const isValid = require("mongoose").isValidObjectId;
const Contact = require("./contactSchema.js");

class ContactController {
  async getAll(req, res, next) {
    try {
      const contacts = await Contact.find();
      return res.status(200).json(contacts);
    } catch (err) {
      console.log(err);
    }
  }

  async getOne(req, res, next) {
    try {
      const id = req.params.contactId;
      if (!isValid(id)) {
        res.status(400).json({ message: "Enter ID" });
      }
      const contact = await Contact.findById(id);
      if (contact === null) {
        res.status(404).json({ message: "Not found" });
      }
      res.status(200).json(contact);
    } catch (err) {
      console.log(err);
    }
  }

  async create(req, res, next) {
    const { name, email, phone } = req.query;
    if (name === undefined || email === undefined || phone === undefined) {
      res.status(400).json({ message: "missing required name field" });
    }
    try {
      const contact = await Contact.create({ name, email, phone });
      res.status(201).json(contact);
    } catch (err) {
      res.status(404).json({ message: err });
    }
  }

  async delete(req, res, next) {
    const id = req.params.contactId;
    if (!isValid(id)) {
      res.status(400).json({ message: "Enter ID" });
    }
    try {
      const contact = await Contact.findByIdAndDelete(id);
      if (contact === null) {
        res.status(404).json({ message: "Not found" });
      }
      return res.status(200).json({ message: "contact deleted" });
    } catch (err) {
      console.log({ message: err });
    }
  }

  async update(req, res, next) {
    const contact = req.body;
    const id = req.params.contactId;
    if (!isValid(id)) {
      res.status(400).json({ message: "Enter ID" });
      return;
    }
    try {
      const updatedContact = await Contact.findByIdAndUpdate(id, contact, {
        new: true,
      });
      if (updatedContact) {
        return res.status(200).json(updatedContact);
      }
      res.status(404).json({ message: "Not found" });
    } catch (err) {
      res.status(404).json({ message: err });
    }
  }

  async favorite(req, res, next) {
    const body = req.body;
    const contactId = req.params.contactId;
    if (!body) {
      res.status(404).json({ message: "missing field favorite" });
    }

    try {
      const updatedContact = await Contact.findByIdAndUpdate(contactId, body, {
        new: true,
      });
      if (updatedContact) {
        return res.status(200).json(updatedContact);
      }
      res.status(404).json({ message: "Not found" });
    } catch (err) {
      res.status(404).json({ message: err });
    }
  }
}

module.exports = new ContactController();
