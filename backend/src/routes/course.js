const router = require("express").Router();
const courseController = require("../controllers/courseController");
const { authorize } = require("../middleware/authMiddlewares");

router.use(authorize(["student", "teacher"]));

router.get("/", courseController.getAllCourses);
router.get("/:id", courseController.getCourseById);

module.exports = router;
