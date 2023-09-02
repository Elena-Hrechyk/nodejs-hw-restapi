const express = require("express");

const authenticate = require("../../middlewares/authenticate");
const ctrl = require("../../controllers/contacts");
const validateBody = require("../../middlewares/validateBody");
const { schema } = require("../../models/contact");
const isValidId = require("../../middlewares/isValidId");
const { updateFavoriteSchema } = require("../../models/contact");

const router = express.Router();

router.get("/", authenticate, ctrl.listContacts);

router.get("/:contactId", authenticate, isValidId, ctrl.getContactById);

router.post("/", authenticate, validateBody(schema), ctrl.addContact);

router.delete("/:contactId", authenticate, isValidId, ctrl.removeContact);

router.put(
  "/:contactId",
  authenticate,
  isValidId,
  validateBody(schema),
  ctrl.updateContact
);

router.patch(
  "/:contactId/favorite",
  authenticate,
  isValidId,
  validateBody(updateFavoriteSchema),
  ctrl.updateStatusContact
);

module.exports = router;
