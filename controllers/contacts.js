const contacts = require("../models/contacts");
const HttpErr = require("../helpers/HttpError");

const listContacts = async (req, res, next) => {
  try {
    const result = await contacts.listContacts();
    if (!result) {
      throw HttpErr(404, "Not found");
    }
    res.json(result);
  } catch (err) {
    next(err);
  }
};
const getContactById = async (req, res, next) => {
  try {
    const { contactId } = req.params;
    const result = await contacts.getContactById(contactId);
    console.log(result);
    if (!result) {
      throw HttpErr(404, "Not found");
    }
    res.json(result);
  } catch (err) {
    next(err);
  }
};

const addContact = async (req, res, next) => {
  try {
    const result = await contacts.addContact(req.body);
    res.json(result);
  } catch (err) {
    next(err);
  }
};

const removeContact = async (req, res, next) => {
  try {
    const { id } = req.params;
    const result = await contacts.removeContact(id);
    if (!result) {
      throw HttpErr(404, "Not found");
    }
    res.json({ message: "Contact deleted" });
  } catch (err) {
    next(err);
  }
};

const updateContact = async (req, res, next) => {
  try {
    const { contactId } = req.params;
    const result = await contacts.updateContact(contactId, req.body);
    if (!result) {
      throw HttpErr(404, "Not found");
    }
    res.json(result);
  } catch (err) {
    next(err);
  }
};

module.exports = {
  listContacts,
  getContactById,
  addContact,
  removeContact,
  updateContact,
};
