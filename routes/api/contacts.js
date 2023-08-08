const express = require("express");
const Joi = require("joi");

const contacts = require("../../models/contacts");
const HttpErr = require("../../helpers/HttpError");

const schema = Joi.object({
  name: Joi.string().min(3).required(),
  email: Joi.string().email().required(),
  phone: Joi.string().min(6).required(),
});

const router = express.Router();

router.get("/", async (req, res, next) => {
  try {
    const result = await contacts.listContacts();
    if (!result) {
      throw HttpErr(404, "Not found");
    }
    res.json(result);
  } catch (err) {
    next(err);
  }
});

router.get("/:contactId", async (req, res, next) => {
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
});

router.post("/", async (req, res, next) => {
  try {
    const { error } = schema.validate(req.body);
    if (error) {
      throw HttpErr(400, error.message);
    }
    const result = await contacts.addContact(req.body);
    res.json(result);
  } catch (err) {
    next(err);
  }
});

router.delete("/:contactId", async (req, res, next) => {
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
});

router.put("/:contactId", async (req, res, next) => {
  try {
    const { error } = schema.validate(req.body);
    console.log(error);
    if (error) {
      throw HttpErr(400, error.message);
    }
    const { contactId } = req.params;
    const result = await contacts.updateContact(contactId, req.body);
    if (!result) {
      throw HttpErr(404, "Not found");
    }
    res.json(result);
  } catch (err) {
    next(err);
  }
});

module.exports = router;
