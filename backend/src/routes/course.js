const router = require("express").Router();
const courseController = require("../controllers/courseController");
const { authorize } = require("../middleware/authMiddlewares");
const {
  courseValidators,
  courseUpdateValidators,
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
    courseValidators.idParamValidator(),
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
    courseValidators.idParamValidator(),
    courseUpdateValidators.shortNameValidator(),
    courseUpdateValidators.nameValidator(),
    courseUpdateValidators.descriptionValidator(),
    courseUpdateValidators.startDateValidator(),
    courseValidators.teacherIdValidator(),
  ],
  courseController.updateCourse
);
router.delete(
  "/:id",
  [authorize(["teacher", "admin"]), courseValidators.idParamValidator()],
  courseController.deleteCourse
);

module.exports = router;
