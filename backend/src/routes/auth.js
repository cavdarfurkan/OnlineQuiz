const router = require("express").Router();
const authController = require("../controllers/authController");
const {
  authValidators,
  commonValidators,
  passwordValidator,
} = require("../utils/validators");

router.post(
  "/login",
  [
    authValidators.emailValidator(),
    passwordValidator.passwordValidator(),
    authValidators.roleQueryValidator(),
  ],
  authController.login
);
router.post(
  "/signup",
  [
    authValidators.emailValidator(),
    passwordValidator.passwordValidator(),
    passwordValidator.confirmPasswordValidator(),
    authValidators.firstnameValidator(),
    authValidators.lastnameValidator(),
    authValidators.roleValidator(),
  ],
  authController.signup
);
router.get("/logout", authController.logout);

module.exports = router;
