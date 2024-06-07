const router = require("express").Router();
const questionController = require("../controllers/questionController");
const { authorize } = require("../middleware/authMiddlewares");
const {
  commonValidators,
  questionValidators,
  optionValidators,
} = require("../utils/validators");

router.get(
  "/",
  [
    authorize(["student", "teacher", "admin"]),
    questionValidators.examIdQueryValidator().optional(),
  ],
  questionController.getAllQuestions
);

router.get(
  "/:id",
  [
    authorize(["student", "teacher", "admin"]),
    commonValidators.idParamValidator(),
  ],
  questionController.getQuestionById
);

router.post(
  "/",
  [
    authorize(["teacher", "admin"]),
    questionValidators.examIdValidator(),
    questionValidators.questionTextValidator(),
  ],
  questionController.createQuestion
);

router.post(
  "/:id/answer",
  [
    authorize(["student"]),
    commonValidators.idParamValidator(),
    optionValidators.answeredOptionIdValidator(),
  ],
  questionController.answerQuestion
);

router.patch(
  "/:id",
  [
    authorize(["teacher", "admin"]),
    commonValidators.idParamValidator(),
    questionValidators.examIdValidator().optional(),
    questionValidators.questionTextValidator().optional(),
  ],
  questionController.updateQuestion
);

router.delete(
  "/:id",
  [authorize(["teacher", "admin"]), commonValidators.idParamValidator()],
  questionController.deleteQuestion
);

module.exports = router;
