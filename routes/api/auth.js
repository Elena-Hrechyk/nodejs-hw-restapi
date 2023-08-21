const express = require("express");
const ctrl = require("../../controllers/auth");
const validateBody = require("../../middlewares/validateBody");
const {
  regUserSchema,
  updateSubscriptionSchema,
} = require("../../models/user");
const authenticate = require("../../middlewares/authenticate");

const router = express.Router();

router.post("/register", validateBody(regUserSchema), ctrl.register);

router.post("/login", validateBody(regUserSchema), ctrl.login);

router.get("/current", authenticate, ctrl.getCurrent);

router.post("/logout", authenticate, ctrl.logout);

router.patch(
  "/subscription",
  validateBody(updateSubscriptionSchema),
  ctrl.updateUserSubscription
);

module.exports = router;
