const router = require("express").Router();
const userController = require("../controllers/userController");
const { authorize } = require("../middleware/authMiddlewares");
const {
  commonValidators,
  userUpdateValidators,
} = require("../utils/validators");

router.get("/", [authorize(["admin"])], userController.getAllUsers);

router.get(
  "/:id",
  [
    authorize(["admin", "student", "teacher"]),
    commonValidators.idParamValidator(),
  ],
  userController.getUserById
);

router.patch(
  "/:id",
  [
    authorize(["admin", "student", "teacher"]),
    commonValidators.idParamValidator(),
    userUpdateValidators.emailValidator(),
    userUpdateValidators.firstnameValidator(),
    userUpdateValidators.lastnameValidator(),
  ],
  userController.updateUser
);

router.delete(
  "/:id",
  [
    authorize(["admin", "student", "teacher"]),
    commonValidators.idParamValidator(),
  ],
  userController.deleteUser
);

module.exports = router;
