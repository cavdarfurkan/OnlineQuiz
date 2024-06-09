const examRepository = require("../repositories/examRepository");
const courseRepository = require("../repositories/courseRepository");
const { validationResult, matchedData } = require("express-validator");
const e = require("express");

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

const getStudentExamsByStudentId = async (req, res) => {
  const errors = validationResult(req).formatWith(({ msg }) => msg);
  if (!errors.isEmpty()) {
    return res.status(400).json({ errors: errors.array() });
  }

  const { id } = matchedData(req);

  // Admins can get exams for any student
  if (req.session.user.role === "admin") {
    const studentExams = await examRepository.getStudentExamsByStudentId(id);
    return res.json(studentExams);
  }

  // Teachers can get exams for their students
  if (req.session.user.role === "teacher") {
    const teacherCourses = await courseRepository.getAllCoursesByTeacherId(
      req.session.user.id
    );

    const studentExams = await examRepository.getStudentExamsByStudentId(id);
    let exams = [];
    for (const studentExam of studentExams) {
      const exam = await examRepository.getExamById(studentExam.exam_id);
      const course = await courseRepository.getCourseById(exam.course_id);
      if (course.teacher_id === req.session.user.id) {
        exams.push(studentExam);
      }
    }

    return res.json(exams);
  }

  // Students can get only their exams
  if (req.session.user.id != id) {
    return res
      .status(403)
      .json({ message: "Unauthorized, can only get own exams" });
  }

  const studentExams = await examRepository.getStudentExamsByStudentId(id);
  res.json(studentExams);
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

const createStudentExam = async (req, res) => {
  const errors = validationResult(req).formatWith(({ msg }) => msg);
  if (!errors.isEmpty()) {
    return res.status(400).json({ errors: errors.array() });
  }

  const { id, start_time, end_time, grade } = matchedData(req);
  await examRepository.createStudentExam(
    req.session.user.id,
    id,
    grade,
    start_time,
    end_time
  );

  res.status(201).json({ message: "Exam submitted" });
};

module.exports = {
  getAllExams,
  getExamById,
  getStudentExamsByStudentId,
  createExam,
  updateExam,
  deleteExam,
  createStudentExam,
};
