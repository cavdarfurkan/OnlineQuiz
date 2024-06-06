const courseRepository = require("../repositories/courseRepository");
const { validationResult, matchedData } = require("express-validator");

const getCourseById = async (req, res) => {
  const errors = validationResult(req).formatWith(({ msg }) => msg);
  if (!errors.isEmpty()) {
    return res.status(400).json({ errors: errors.array() });
  }

  const { id } = req.params;
  const course = await courseRepository.getCourseById(id);
  if (!course) {
    return res.status(404).json({ message: "Course not found" });
  }

  return res.status(200).json(course);
};

const getAllCourses = async (req, res) => {
  const courses = await courseRepository.getAllCourses();
  return res.status(200).json(courses);
};

const getAllCoursesByUser = async (req, res) => {
  const user = req.session.user;

  if (user.role === "teacher") {
    const courses = await courseRepository.getAllCoursesByTeacherId(user.id);
    return res.status(200).json(courses);
  }
  if (user.role === "student") {
    const courses = await courseRepository.getAllCoursesByStudentId(user.id);
    return res.status(200).json(courses);
  }

  return res.status(403).json({ message: "Unauthorized" });
};

const createCourse = async (req, res) => {
  const errors = validationResult(req).formatWith(({ msg }) => msg);
  if (!errors.isEmpty()) {
    return res.status(400).json({ errors: errors.array() });
  }

  const data = matchedData(req);

  // Only admins can provide teacher_id
  if (data.teacher_id && req.session.user.role !== "admin") {
    return res
      .status(403)
      .json({ message: "Only admins can provide teacher_id" });
  }

  const courseId = await courseRepository.createCourse(
    data.short_name,
    data.name,
    data.description,
    data.start_date,
    data.teacher_id || req.session.user.id
  );

  return res.status(201).json({ id: courseId });
};

const updateCourse = async (req, res) => {
  const errors = validationResult(req).formatWith(({ msg }) => msg);
  if (!errors.isEmpty()) {
    return res.status(400).json({ errors: errors.array() });
  }

  const data = matchedData(req);

  // If the user is not an admin, they can only update their own courses
  if (req.session.user.role !== "admin") {
    const course = await courseRepository.getCourseById(data.id);
    if (!course) {
      return res.status(404).json({ message: "Course not found" });
    }
    if (course.teacher_id !== req.session.user.id) {
      return res.status(403).json({ message: "Forbidden" });
    }
  }

  let clause = "";
  for (const field of Object.keys(data)) {
    if (field === "id") continue;
    if (clause !== "") clause += ", ";
    clause += `${field} = '${data[field]}'`;
  }

  if (clause === "") {
    return res.status(400).json({ message: "No fields provided" });
  }

  const affectedRows = await courseRepository.updateCourse(data.id, clause);

  if (!affectedRows) {
    return res.status(404).json({ message: "Course not found" });
  }

  return res.status(200).json({ message: "Course updated" });
};

const deleteCourse = async (req, res) => {
  const errors = validationResult(req).formatWith(({ msg }) => msg);
  if (!errors.isEmpty()) {
    return res.status(400).json({ errors: errors.array() });
  }

  const { id } = req.params;

  // If the user is not an admin, they can only delete their own courses
  if (req.session.user.role !== "admin") {
    const course = await courseRepository.getCourseById(id);
    if (!course) {
      return res.status(404).json({ message: "Course not found" });
    }
    if (course.teacher_id !== req.session.user.id) {
      return res.status(403).json({ message: "Forbidden" });
    }
  }

  const affectedRows = await courseRepository.deleteCourse(id);

  if (!affectedRows) {
    return res.status(404).json({ message: "Course not found" });
  }

  return res.status(200).json({ message: "Course deleted" });
};

module.exports = {
  getCourseById,
  getAllCourses,
  getAllCoursesByUser,
  createCourse,
  updateCourse,
  deleteCourse,
};
