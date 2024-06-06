const examRepository = require("../repositories/examRepository");
const courseRepository = require("../repositories/courseRepository");
const { validationResult, matchedData } = require("express-validator");

const getAllExams = async (req, res) => {
  const errors = validationResult(req).formatWith(({ msg }) => msg);
  if (!errors.isEmpty()) {
    return res.status(400).json({ errors: errors.array() });
  }

  const { courseId } = matchedData(req);
  if (courseId) {
    const exams = await examRepository.getAllExamsByCourse(courseId);
    return res.json(exams);
  }

  const exams = await examRepository.getAllExams();
  res.json(exams);
};

const getExamById = async (req, res) => {
  const errors = validationResult(req).formatWith(({ msg }) => msg);
  if (!errors.isEmpty()) {
    return res.status(400).json({ errors: errors.array() });
  }

  const { id } = matchedData(req);

  const exam = await examRepository.getExamById(id);
  if (!exam) {
    return res.status(404).json({ message: "Exam not found" });
  }
  res.json(exam);
};

const createExam = async (req, res) => {
  const errors = validationResult(req).formatWith(({ msg }) => msg);
  if (!errors.isEmpty()) {
    return res.status(400).json({ errors: errors.array() });
  }

  const data = matchedData(req);

  // Admins can create exams for any course
  if (req.session.user.role === "admin") {
    const examId = await examRepository.createExam(data);
    return res.status(201).json({ id: examId });
  }

  // Teachers can create exams only for their courses
  const teacherCourses = await courseRepository
    .getAllCoursesByTeacherId(req.session.user.id)
    .then((courses) => courses.map((course) => course.id.toString()));

  if (teacherCourses.includes(data.course_id)) {
    const examId = await examRepository.createExam(data);
    return res.status(201).json({ id: examId });
  } else {
    return res
      .status(403)
      .json({ message: "Unauthorized, can only create exam for own courses" });
  }
};

const updateExam = async (req, res) => {
  const errors = validationResult(req).formatWith(({ msg }) => msg);
  if (!errors.isEmpty()) {
    return res.status(400).json({ errors: errors.array() });
  }

  const { id, ...data } = matchedData(req);
  const exam = await examRepository.getExamById(id);

  if (!exam) {
    return res.status(404).json({ message: "Exam not found" });
  }

  let clause = "";
  for (const key in data) {
    if (clause !== "") clause += ", ";
    clause += `${key} = '${data[key]}'`;
  }
  if (clause === "") {
    return res.status(400).json({ message: "No fields to update" });
  }

  // Admins can update any exam
  if (req.session.user.role === "admin") {
    const affectedRows = await examRepository.updateExam(id, clause);
    if (!affectedRows) {
      return res.status(404).json({ message: "Exam not found" });
    }
    return res.json({ message: "Exam updated successfully" });
  }

  // Teachers can update exams only for their courses
  const teacherCourses = await courseRepository
    .getAllCoursesByTeacherId(req.session.user.id)
    .then((courses) => courses.map((course) => course.id.toString()));

  if (teacherCourses.includes(exam.course_id.toString())) {
    const affectedRows = await examRepository.updateExam(id, clause);
    if (!affectedRows) {
      return res.status(404).json({ message: "Exam not found" });
    }
    return res.json({ message: "Exam updated successfully" });
  } else {
    return res
      .status(403)
      .json({ message: "Unauthorized, can only update exam for own courses" });
  }
};

const deleteExam = async (req, res) => {
  const errors = validationResult(req).formatWith(({ msg }) => msg);
  if (!errors.isEmpty()) {
    return res.status(400).json({ errors: errors.array() });
  }

  const { id } = matchedData(req);
  const exam = await examRepository.getExamById(id);

  if (!exam) {
    return res.status(404).json({ message: "Exam not found" });
  }

  // Admins can delete any exam
  if (req.session.user.role === "admin") {
    return await examRepository
      .deleteExam(id)
      .then(() => res.json({ message: "Exam deleted" }))
      .catch((error) => {
        console.error(error);
        return res.status(500).json({ message: "Internal server error" });
      });
  }

  // Teachers can delete exams only for their courses
  const teacherCourses = await courseRepository
    .getAllCoursesByTeacherId(req.session.user.id)
    .then((courses) => courses.map((course) => course.id.toString()));

  if (!teacherCourses.includes(exam.course_id.toString())) {
    return res
      .status(403)
      .json({ message: "Unauthorized, can only delete exam for own courses" });
  }

  return await examRepository
    .deleteExam(id)
    .then(() => res.json({ message: "Exam deleted" }))
    .catch((error) => {
      console.error(error);
      return res.status(500).json({ message: "Internal server error" });
    });
};

module.exports = {
  getAllExams,
  getExamById,
  createExam,
  updateExam,
  deleteExam,
};
