const express = require("express");
const ctrl = require("../../controllers/auth");
const validateBody = require("../../middlewares/validateBody");
const {
  regUserSchema,
  updateSubscriptionSchema,
  emailSchema,
} = require("../../models/user");
const authenticate = require("../../middlewares/authenticate");
const upload = require("../../middlewares/upload");

const router = express.Router();

router.post("/register", validateBody(regUserSchema), ctrl.register);

router.get("/verify/:verificationToken", ctrl.verifyEmail);

router.post("/verify", validateBody(emailSchema), ctrl.resendVerifyEmail);

router.post("/login", validateBody(regUserSchema), ctrl.login);

router.get("/current", authenticate, ctrl.getCurrent);

router.post("/logout", authenticate, ctrl.logout);

router.patch(
  "/subscription",
  validateBody(updateSubscriptionSchema),
  ctrl.updateUserSubscription
);

router.patch(
  "/avatars",
  authenticate,
  upload.single("avatar"),
  ctrl.updateAvatar
);

module.exports = router;
