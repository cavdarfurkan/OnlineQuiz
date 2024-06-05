const { body, param, query } = require("express-validator");

const authValidators = {
  emailValidator: () =>
    body("email")
      .notEmpty()
      .withMessage("Email is required")
      .isEmail()
      .withMessage("Invalid email")
      .normalizeEmail()
      .escape(),
  passwordValidator: () =>
    body("password")
      .notEmpty()
      .withMessage("Password is required")
      .isLength({ min: 5 })
      .withMessage("Password must be minimum 5 characters")
      .escape(),
  // confirmPasswordValidator: () =>
  //   body("confirmPassword").custom((value, { req }) => {
  //     if (value !== req.body.password) {
  //       throw new Error("Passwords do not match");
  //     }
  //     return true;
  //   }),
  firstnameValidator: () =>
    body("firstname")
      .notEmpty()
      .withMessage("Firstname is required")
      .isLength({ min: 2 })
      .withMessage("Firstname is too short")
      .trim()
      .escape(),
  lastnameValidator: () =>
    body("lastname")
      .notEmpty()
      .withMessage("Lastname is required")
      .isLength({ min: 2 })
      .withMessage("Lastname is too short")
      .trim()
      .escape(),
  roleValidator: () =>
    body("role")
      .notEmpty()
      .withMessage("Role is required")
      .isIn(["student", "teacher", "admin"])
      .withMessage("Invalid role")
      .escape(),
  roleQueryValidator: () =>
    query("role")
      .notEmpty()
      .withMessage("Role is required")
      .isIn(["student", "teacher", "admin"])
      .withMessage("Invalid role")
      .escape(),
};

const courseValidators = {
  idParamValidator: () =>
    param("id")
      // .notEmpty()
      // .withMessage("ID is required")
      .isInt()
      .withMessage("ID must be an integer"),
};

module.exports = {
  authValidators,
  courseValidators,
};
