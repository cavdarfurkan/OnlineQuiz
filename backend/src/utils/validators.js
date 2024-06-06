const { body, param, query } = require("express-validator");
const userRepository = require("../repositories/userRepository");
const courseRepository = require("../repositories/courseRepository");

const authValidators = {
  emailValidator: () =>
    body("email")
      .notEmpty()
      .withMessage("Email is required")
      .isEmail()
      .withMessage("Invalid email")
      .normalizeEmail()
      .escape(),
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
  shortNameValidator: () =>
    body("short_name")
      .notEmpty()
      .withMessage("Short name is required")
      .isLength({ min: 3 })
      .withMessage("Short name must be minimum 3 characters")
      .trim()
      .custom(async (value) => {
        const course = await courseRepository.getCourseByShortName(value);
        if (course) {
          throw new Error("Short name already exists");
        }
        return true;
      })
      .escape(),
  nameValidator: () =>
    body("name")
      .notEmpty()
      .withMessage("Name is required")
      .isLength({ min: 5 })
      .withMessage("Name is too short")
      .trim()
      .escape(),
  descriptionValidator: () =>
    body("description")
      .notEmpty()
      .withMessage("Description is required")
      .isLength({ min: 5 })
      .withMessage("Description is too short")
      .trim()
      .escape(),
  startDateValidator: () =>
    body("start_date")
      .notEmpty()
      .withMessage("Start date is required")
      .isISO8601()
      .withMessage("Invalid date"),
  teacherIdValidator: () =>
    body("teacher_id")
      .optional()
      .isInt()
      .withMessage("Teacher ID must be an integer")
      .custom(async (value) => {
        const user = await userRepository.getUserById(value);
        if (!user) {
          throw new Error("Teacher not found");
        }
        const roles = await userRepository.getUserRoles(user.id);
        if (!roles.includes("teacher")) {
          throw new Error("User is not a teacher");
        }
        return true;
      }),
};

const courseUpdateValidators = {
  shortNameValidator: () =>
    body("short_name")
      .optional()
      .isLength({ min: 3 })
      .withMessage("Short name must be minimum 3 characters")
      .trim()
      .escape(),
  nameValidator: () =>
    body("name")
      .optional()
      .isLength({ min: 5 })
      .withMessage("Name is too short")
      .trim()
      .escape(),
  descriptionValidator: () =>
    body("description")
      .optional()
      .isLength({ min: 5 })
      .withMessage("Description is too short")
      .trim()
      .escape(),
  startDateValidator: () =>
    body("start_date").optional().isISO8601().withMessage("Invalid date"),
  archiveValidator: () =>
    body("is_archived")
      .optional()
      .custom((value) => {
        if (value === "0" || value === "1") {
          return true;
        }
        throw new Error("Invalid value for is_archived, must be 0 or 1");
      }),
};

const userUpdateValidators = {
  emailValidator: () =>
    body("email")
      .optional()
      .isEmail()
      .withMessage("Invalid email")
      .normalizeEmail()
      .escape(),
  firstnameValidator: () =>
    body("firstname")
      .optional()
      .isLength({ min: 2 })
      .withMessage("Firstname is too short")
      .trim()
      .escape(),
  lastnameValidator: () =>
    body("lastname")
      .optional()
      .isLength({ min: 2 })
      .withMessage("Lastname is too short")
      .trim()
      .escape(),
};

const examValidators = {
  courseIdQueryValidator: () =>
    query("courseId").isInt().withMessage("ID must be an integer"),
  courseIdValidator: () =>
    body("course_id")
      .notEmpty()
      .withMessage("Course ID is required")
      .isInt()
      .withMessage("Course ID must be an integer")
      .custom(async (value) => {
        const course = await courseRepository.getCourseById(value);
        if (!course) {
          throw new Error("Course not found");
        }
        return true;
      }),
  titleValidator: () =>
    body("title")
      .notEmpty()
      .withMessage("Title is required")
      .isLength({ min: 3 })
      .withMessage("Title is too short")
      .trim()
      .escape(),
  dateValidator: () =>
    body("date")
      .notEmpty()
      .withMessage("Date is required")
      .isISO8601()
      .withMessage("Invalid date")
      .escape(),
  durationValidator: () =>
    body("duration_min")
      .notEmpty()
      .withMessage("Duration is required")
      .isInt()
      .withMessage("Duration must be an integer")
      .custom((value) => {
        if (value < 1) {
          throw new Error("Duration must be greater than 0");
        }
        return true;
      }),
  passPercentValidator: () =>
    body("pass_percent")
      .optional()
      .isInt()
      .withMessage("Pass percent must be an integer")
      .custom((value) => {
        if (value < 1 || value > 100) {
          throw new Error("Pass percent must be between 1 and 100");
        }
        return true;
      }),
};

const examUpdateValidators = {
  titleValidator: () =>
    body("title")
      .optional()
      .isLength({ min: 3 })
      .withMessage("Title is too short")
      .trim()
      .escape(),
  dateValidator: () =>
    body("date").optional().isISO8601().withMessage("Invalid date").escape(),
  durationValidator: () =>
    body("duration_min")
      .optional()
      .isInt()
      .withMessage("Duration must be an integer")
      .custom((value) => {
        if (value < 1) {
          throw new Error("Duration must be greater than 0");
        }
        return true;
      }),
  courseIdValidator: () =>
    body("course_id")
      .optional()
      .isInt()
      .withMessage("Course ID must be an integer")
      .custom(async (value) => {
        const course = await courseRepository.getCourseById(value);
        if (!course) {
          throw new Error("Course not found");
        }
        return true;
      }),
};

const passwordValidator = {
  passwordValidator: () =>
    body("password")
      .notEmpty()
      .withMessage("Password is required")
      .isLength({ min: 5 })
      .withMessage("Password must be minimum 5 characters")
      .escape(),
  confirmPasswordValidator: () =>
    body("confirm_password")
      .notEmpty()
      .withMessage("Confirm password is required")
      .custom((value, { req }) => {
        if (value !== req.body.password) {
          throw new Error("Passwords do not match");
        }
        return true;
      }),
};

const commonValidators = {
  idParamValidator: () =>
    param("id")
      .notEmpty()
      .withMessage("ID is required")
      .isInt()
      .withMessage("ID must be an integer"),
};

module.exports = {
  authValidators,
  courseValidators,
  courseUpdateValidators,
  userUpdateValidators,
  examValidators,
  examUpdateValidators,
  passwordValidator,
  commonValidators,
};
