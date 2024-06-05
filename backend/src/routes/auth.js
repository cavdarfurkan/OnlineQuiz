const router = require("express").Router();
const authController = require("../controllers/authController");
const { authValidators } = require("../utils/validators");

router.post(
  "/login",
  [
    authValidators.emailValidator(),
    authValidators.passwordValidator(),
    authValidators.roleQueryValidator(),
  ],
  authController.login
);
router.post(
  "/signup",
  [
    authValidators.emailValidator(),
    authValidators.passwordValidator(),
    authValidators.firstnameValidator(),
    authValidators.lastnameValidator(),
    authValidators.roleValidator(),
  ],
  authController.signup
);
router.get("/logout", authController.logout);

module.exports = router;
