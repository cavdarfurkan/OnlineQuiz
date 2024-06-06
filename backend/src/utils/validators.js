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
      .notEmpty()
      .withMessage("ID is required")
      .isInt()
      .withMessage("ID must be an integer"),
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
};

// const courseEnrollmentValidators = {
//   courseIdValidator: () =>
//     body("course_id")
//       .notEmpty()
//       .withMessage("Course ID is required")
//       .isInt()
//       .withMessage("Course ID must be an integer")
//       .custom(async (value) => {
//         const course = await courseRepository.getCourseById(value);
//         if (!course) {
//           throw new Error("Course not found");
//         }
//         return true;
//       }),
//   studentIdValidator: () =>
//     body("student_id")
//       .notEmpty()
//       .withMessage("Student ID is required")
//       .isInt()
//       .withMessage("Student ID must be an integer")
//       .custom(async (value) => {
//         const user = await userRepository.getUserById(value);
//         if (!user) {
//           throw new Error("Student not found");
//         }
//         const roles = await userRepository.getUserRoles(user.id);
//         if (!roles.includes("student")) {
//           throw new Error("User is not a student");
//         }
//         return true;
//       }),
//   invitationCodeValidator: () =>
//     body("invitation_code")
//       .notEmpty()
//       .withMessage("Invitation code is required")
//       .isLength({ min: 6 })
//       .withMessage("Invitation code must be 6 characters")
//       .isAlphanumeric()
//       .withMessage("Invitation code must be alphanumeric")
//       .custom(async (value, { req }) => {
//         const course = await courseRepository.getCourseByInvitationCode(value);
//         if (!course) {
//           throw new Error("Course not found");
//         }
//         if (course.teacher_id === req.session.user.id) {
//           throw new Error("Teacher cannot enroll in own course");
//         }
//         return true;
//       }),
// };

module.exports = {
  authValidators,
  courseValidators,
  courseUpdateValidators,
};
