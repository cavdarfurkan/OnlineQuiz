const router = require("express").Router();
const examController = require("../controllers/examController");
const { authorize } = require("../middleware/authMiddlewares");
const {
  commonValidators,
  examValidators,
  examUpdateValidators,
} = require("../utils/validators");

router.get(
  "/",
  [
    authorize(["student", "teacher", "admin"]),
    examValidators.courseIdQueryValidator().optional(),
  ],
  examController.getAllExams
);

router.get(
  "/:id",
  [
    authorize(["student", "teacher", "admin"]),
    commonValidators.idParamValidator(),
  ],
  examController.getExamById
);

router.post(
  "/",
  [
    authorize(["teacher", "admin"]),
    examValidators.titleValidator(),
    examValidators.dateValidator(),
    examValidators.durationValidator(),
    examValidators.passPercentValidator(),
    examValidators.courseIdValidator(),
  ],
  examController.createExam
);

router.patch(
  "/:id",
  [
    authorize(["teacher", "admin"]),
    commonValidators.idParamValidator(),
    examUpdateValidators.titleValidator(),
    examUpdateValidators.dateValidator(),
    examUpdateValidators.durationValidator(),
    examValidators.passPercentValidator(),
    examUpdateValidators.courseIdValidator(),
  ],
  examController.updateExam
);

router.delete(
  "/:id",
  [authorize(["teacher", "admin"]), commonValidators.idParamValidator()],
  examController.deleteExam
);

module.exports = router;
