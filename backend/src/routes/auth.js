const router = require("express").Router();
const authController = require("../controllers/authController");
const {
  emailValidator,
  passwordValidator,
  firstnameValidator,
  lastnameValidator,
  roleValidator,
} = require("../utils/validators");

router.post(
  "/login",
  [emailValidator(), passwordValidator()],
  authController.login
);
router.post(
  "/signup",
  [
    emailValidator(),
    passwordValidator(),
    firstnameValidator(),
    lastnameValidator(),
    roleValidator(),
  ],
  authController.signup
);
router.get("/logout", authController.logout);

module.exports = router;
