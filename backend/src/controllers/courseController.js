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

const getUpcomingCourses = async (req, res) => {
  const today = new Date().toISOString().split("T")[0].toString();
  const courses = await courseRepository.getUpcomingCourses(
    req.session.user.id,
    today
  );
  return res.status(200).json(courses);
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

  // Admins have to provide teacher_id
  if (!data.teacher_id && req.session.user.role === "admin") {
    return res.status(400).json({ message: "teacher_id is required" });
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

  await courseRepository
    .deleteCourse(id)
    .then(() => {
      return res.status(200).json({ message: "Course deleted" });
    })
    .catch((error) => {
      console.error(error);
      return res.status(500).json({ message: "Internal server error" });
    });
};

const getStudentsByCourseId = async (req, res) => {
  const errors = validationResult(req).formatWith(({ msg }) => msg);
  if (!errors.isEmpty()) {
    return res.status(400).json({ errors: errors.array() });
  }

  const { id } = matchedData(req);
  const course = await courseRepository.getCourseById(id);
  if (!course) {
    return res.status(404).json({ message: "Course not found" });
  }

  const students = await courseRepository.getStudentsByCourseId(id);
  return res.status(200).json(students);
};

const joinCourse = async (req, res) => {
  const errors = validationResult(req).formatWith(({ msg }) => msg);
  if (!errors.isEmpty()) {
    return res.status(400).json({ errors: errors.array() });
  }

  const user = req.session.user;
  const { invitation } = matchedData(req);
  const course = await courseRepository.getCourseByInvitationCode(invitation);

  if (!course) {
    return res.status(404).json({ message: "Course not found" });
  }

  const courseStudents = await courseRepository.getStudentsByCourseId(
    course.id
  );
  if (courseStudents.some((student) => student.id === user.id)) {
    return res.status(400).json({ message: "User is already in course" });
  }

  await courseRepository.joinCourse(user.id, course.id);
  return res.status(200).json({ message: "User joined course" });
};

module.exports = {
  getCourseById,
  getAllCourses,
  getAllCoursesByUser,
  getUpcomingCourses,
  createCourse,
  updateCourse,
  deleteCourse,
  getStudentsByCourseId,
  joinCourse,
};
