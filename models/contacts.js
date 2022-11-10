const fs = require("fs/promises");
const path = require("path");
const contactsPath = path.join(__dirname, "./contacts.json");
const shortid = require("shortid");

const listContacts = async () => {
  try {
    const data = await fs.readFile(contactsPath);
    const contacts = JSON.parse(data);
    return contacts;
  } catch (err) {
    console.error(err.message);
  }
};

const getById = async (contactId) => {
  try {
    const data = await fs.readFile(contactsPath);
    const contacts = JSON.parse(data);
    const contactById = contacts.filter(
      (contact) => contact.id === contactId.toString()
    );
    if (contactById.length > 0) {
      return contactById;
    }
    console.log(`There are no contact with ID:${contactId}`);
  } catch (err) {
    console.error(err.message);
  }
};

const removeContact = async (contactId) => {
  const data = await fs.readFile(contactsPath);
  const contacts = JSON.parse(data);
  const filteredContacts = contacts.filter(
    (contact) => contact.id !== contactId
  );
  try {
    await fs.writeFile(contactsPath, JSON.stringify(filteredContacts));
    console.log(`Contact with ID: ${contactId} was deleted!`);
    return filteredContacts;
  } catch (err) {
    console.error(err.message);
  }
};

const addContact = async (value) => {
  const { name, email, phone } = value;
  try {
    const contactNew = {
      id: shortid.generate(),
      name: name,
      email: email,
      phone: phone,
    };
    const data = await fs.readFile(contactsPath);
    const contacts = JSON.parse(data);
    const contactsList = [contactNew, ...contacts];
    await fs.writeFile(contactsPath, JSON.stringify(contactsList));
    return contactNew;
  } catch (err) {
    console.error(err.message);
  }
};

const updateContact = async (contactId, value) => {
  let { name, email, phone } = value;
  const data = await fs.readFile(contactsPath);
  const contacts = JSON.parse(data);
  const index = contacts.findIndex((c) => c.id === contactId);
  if (index === -1) return null;
  const contact = data[index];
  name = name || contact.name;
  email = email || contact.email;
  phone = phone || contact.phone;
  const newContact = { id: contactId, name, email, phone };
  await contacts.splice(index, 1, newContact);
  await fs.writeFile(contactsPath, JSON.stringify(contacts));
  return newContact;
};

module.exports = {
  listContacts,
  getById,
  removeContact,
  addContact,
  updateContact,
};
