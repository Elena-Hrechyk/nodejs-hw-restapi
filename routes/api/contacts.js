const express = require("express");

const ctrl = require("../../controllers/contacts");
const validateBody = require("../../middlewares/validateBody");
const { schema } = require("../../models/contact");
const isValidId = require("../../middlewares/isValidId");
const { updateFavoriteSchema } = require("../../models/contact");

const router = express.Router();

router.get("/", ctrl.listContacts);

router.get("/:contactId", isValidId, ctrl.getContactById);

router.post("/", validateBody(schema), ctrl.addContact);

router.delete("/:contactId", isValidId, ctrl.removeContact);

router.put("/:contactId", isValidId, validateBody(schema), ctrl.updateContact);

router.patch(
  "/:contactId/favorite",
  isValidId,
  validateBody(updateFavoriteSchema),
  ctrl.updateStatusContact
);

module.exports = router;
