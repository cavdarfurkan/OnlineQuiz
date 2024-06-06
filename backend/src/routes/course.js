const router = require("express").Router();
const courseController = require("../controllers/courseController");
const { authorize } = require("../middleware/authMiddlewares");
const {
  courseValidators,
  courseUpdateValidators,
  commonValidators,
} = require("../utils/validators");

router.get(
  "/",
  authorize(["student", "teacher"]),
  courseController.getAllCoursesByUser
);

router.get(
  "/:id",
  [
    authorize(["student", "teacher", "admin"]),
    commonValidators.idParamValidator(),
  ],
  courseController.getCourseById
);

router.post(
  "/",
  [
    authorize(["teacher", "admin"]),
    courseValidators.shortNameValidator(),
    courseValidators.nameValidator(),
    courseValidators.descriptionValidator(),
    courseValidators.startDateValidator(),
    courseValidators.teacherIdValidator(),
  ],
  courseController.createCourse
);

router.patch(
  "/:id",
  [
    authorize(["teacher", "admin"]),
    commonValidators.idParamValidator(),
    courseUpdateValidators.shortNameValidator(),
    courseUpdateValidators.nameValidator(),
    courseUpdateValidators.descriptionValidator(),
    courseUpdateValidators.startDateValidator(),
    courseValidators.teacherIdValidator(),
    courseUpdateValidators.archiveValidator(),
  ],
  courseController.updateCourse
);

// router.post(
//   "/:id/join",
//   [authorize(["student"]), commonValidators.idParamValidator()],
//   courseController.joinCourse
// );

router.delete(
  "/:id",
  [authorize(["teacher", "admin"]), commonValidators.idParamValidator()],
  courseController.deleteCourse
);

module.exports = router;
