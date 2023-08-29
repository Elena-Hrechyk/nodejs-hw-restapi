const { Contact } = require("../models/contact");
const HttpErr = require("../helpers/HttpError");

const listContacts = async (req, res, next) => {
  try {
    const { _id: owner } = req.user;
    const { page = 1, limit = 3, favorite = null } = req.query;
    const skip = (page - 1) * limit;

    const result =
      favorite === null
        ? await Contact.find({ owner }, null, {
            skip,
            limit,
          }).populate("owner", "email subscription")
        : await Contact.find({ owner, favorite }, null, {
            skip,
            limit,
          }).populate("owner", "email subscription");

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
    const result = await Contact.findById(contactId);
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
    const { _id: owner } = req.user;
    const result = await Contact.create({ ...req.body, owner });
    console.log(req.body);
    res.status(201).json(result);
  } catch (err) {
    next(err);
  }
};

const removeContact = async (req, res, next) => {
  try {
    const { contactId } = req.params;
    const result = await Contact.findByIdAndRemove(contactId);
    if (!result) {
      console.log(req.params);
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
    const result = await Contact.findByIdAndUpdate(contactId, req.body, {
      new: true,
    });
    if (!result) {
      throw HttpErr(404, "Not found");
    }
    res.json(result);
  } catch (err) {
    next(err);
  }
};

const updateStatusContact = async (req, res, next) => {
  try {
    const { contactId } = req.params;
    const result = await Contact.findByIdAndUpdate(contactId, req.body, {
      new: true,
    });
    if (!result) {
      throw HttpErr(404, "Not found");
    }
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
  updateStatusContact,
};
