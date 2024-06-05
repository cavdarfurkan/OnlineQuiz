const { body } = require("express-validator");

const emailValidator = () =>
  body("email")
    .notEmpty()
    .withMessage("Email is required")
    .isEmail()
    .withMessage("Invalid email")
    .normalizeEmail()
    .escape();

const passwordValidator = () =>
  body("password")
    .notEmpty()
    .withMessage("Password is required")
    .isLength({ min: 5 })
    .withMessage("Password must be minimum 5 characters")
    .escape();

// const confirmPasswordValidator = () =>
//   body("confirmPassword").custom((value, { req }) => {
//     if (value !== req.body.password) {
//       throw new Error("Passwords do not match");
//     }
//     return true;
//   });

const firstnameValidator = () =>
  body("firstname")
    .notEmpty()
    .withMessage("Firstname is required")
    .isLength({ min: 2 })
    .withMessage("Firstname is too short")
    .trim()
    .escape();

const lastnameValidator = () =>
  body("lastname")
    .notEmpty()
    .withMessage("Lastname is required")
    .isLength({ min: 2 })
    .withMessage("Lastname is too short")
    .trim()
    .escape();

const roleValidator = () =>
  body("role")
    .notEmpty()
    .withMessage("Role is required")
    .isIn(["student", "teacher", "admin"])
    .withMessage("Invalid role")
    .escape();

module.exports = {
  emailValidator,
  passwordValidator,
  // confirmPasswordValidator,
  firstnameValidator,
  lastnameValidator,
  roleValidator,
};
