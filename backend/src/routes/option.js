const router = require("express").Router();
const optionController = require("../controllers/optionController");
const { authorize } = require("../middleware/authMiddlewares");
const { optionValidators, commonValidators } = require("../utils/validators");

router.get(
  "/",
  [
    authorize(["student", "teacher", "admin"]),
    optionValidators.questionIdQueryValidator(),
  ],
  optionController.getAllOptionsByQuestionId
);

router.post(
  "/",
  [
    authorize(["teacher", "admin"]),
    optionValidators.questionIdValidator(),
    optionValidators.optionTextValidator(),
    optionValidators.isCorrectValidator(),
  ],
  optionController.createOption
);

router.patch(
  "/:id",
  [
    authorize(["teacher", "admin"]),
    commonValidators.idParamValidator(),
    optionValidators.optionTextValidator().optional(),
    optionValidators.questionIdValidator().optional(),
    optionValidators.isCorrectValidator().optional(),
  ],
  optionController.updateOption
);

router.delete(
  "/:id",
  [authorize(["teacher", "admin"]), commonValidators.idParamValidator()],
  optionController.deleteOption
);

module.exports = router;
