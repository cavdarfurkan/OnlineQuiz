const questionRepository = require("../repositories/questionRepository");
const examRepository = require("../repositories/examRepository");
const courseRepository = require("../repositories/courseRepository");
const { validationResult, matchedData } = require("express-validator");

const getAllQuestions = async (req, res) => {
  const errors = validationResult(req).formatWith(({ msg }) => msg);
  if (!errors.isEmpty()) {
    return res.status(400).json({ errors: errors.array() });
  }

  const { examId } = matchedData(req);
  if (examId) {
    const questions = await questionRepository.getAllQuestionsByExam(examId);
    return res.json(questions);
  }

  const questions = await questionRepository.getAllQuestions();
  res.json(questions);
};

const getQuestionById = async (req, res) => {
  const errors = validationResult(req).formatWith(({ msg }) => msg);
  if (!errors.isEmpty()) {
    return res.status(400).json({ errors: errors.array() });
  }

  const { id } = matchedData(req);

  const question = await questionRepository.getQuestionById(id);
  if (!question) {
    return res.status(404).json({ message: "Question not found" });
  }
  res.json(question);
};

const createQuestion = async (req, res) => {
  const errors = validationResult(req).formatWith(({ msg }) => msg);
  if (!errors.isEmpty()) {
    return res.status(400).json({ errors: errors.array() });
  }

  const { exam_id, question_text } = matchedData(req);
  const exam = await examRepository.getExamById(exam_id);

  if (!exam) {
    return res.status(404).json({ message: "Exam not found" });
  }
  const course = await courseRepository.getCourseById(exam.course_id);

  // Admins can create questions for any exam
  if (req.session.user.role === "admin") {
    const questionId = await questionRepository.createQuestion({
      exam_id,
      question_text,
    });
    return res.status(201).json({ id: questionId });
  }

  // Teachers can create questions only for their exams
  if (course.teacher_id === req.session.user.id) {
    const questionId = await questionRepository.createQuestion({
      exam_id,
      question_text,
    });
    return res.status(201).json({ id: questionId });
  } else {
    return res.status(403).json({
      message: "Unauthorized to create question for this exam",
    });
  }
};

const updateQuestion = async (req, res) => {
  const errors = validationResult(req).formatWith(({ msg }) => msg);
  if (!errors.isEmpty()) {
    return res.status(400).json({ errors: errors.array() });
  }

  const { id, ...data } = matchedData(req);
  const question = await questionRepository.getQuestionById(id);

  if (!question) {
    return res.status(404).json({ message: "Question not found" });
  }

  let clause = "";
  for (const key in data) {
    if (clause !== "") clause += ", ";
    clause += `${key} = '${data[key]}'`;
  }
  if (clause === "") {
    return res.status(400).json({ message: "No fields to update" });
  }

  // Admins can update any question
  if (req.session.user.role === "admin") {
    const affectedRows = await questionRepository.updateQuestion(id, clause);
    if (!affectedRows) {
      return res.status(400).json({ message: "Question not found" });
    }
    return res.json({ message: "Question updated" });
  }

  // Teachers can update questions only for their exams
  const exam = await examRepository.getExamById(question.exam_id);
  const course = await courseRepository.getCourseById(exam.course_id);

  if (course.teacher_id === req.session.user.id) {
    const affectedRows = await questionRepository.updateQuestion(id, clause);
    if (!affectedRows) {
      return res.status(400).json({ message: "Question not found" });
    }
    return res.json({ message: "Question updated" });
  } else {
    return res.status(403).json({
      message: "Unauthorized to update question for this exam",
    });
  }
};

const deleteQuestion = async (req, res) => {
  const errors = validationResult(req).formatWith(({ msg }) => msg);
  if (!errors.isEmpty()) {
    return res.status(400).json({ errors: errors.array() });
  }

  const { id } = matchedData(req);
  const question = await questionRepository.getQuestionById(id);

  if (!question) {
    return res.status(404).json({ message: "Question not found" });
  }

  // Admins can delete any question
  if (req.session.user.role === "admin") {
    return await questionRepository
      .deleteQuestion(id)
      .then(() => res.json({ message: "Question deleted" }))
      .catch((err) => {
        console.error(err);
        return res.status(500).json({ message: "Error deleting question" });
      });
  }

  // Teachers can delete questions only for their exams
  const exam = await examRepository.getExamById(question.exam_id);
  const course = await courseRepository.getCourseById(exam.course_id);

  if (course.teacher_id === req.session.user.id) {
    return await questionRepository
      .deleteQuestion(id)
      .then(() => res.json({ message: "Question deleted" }))
      .catch((err) => {
        console.error(err);
        return res.status(500).json({ message: "Error deleting question" });
      });
  } else {
    return res.status(403).json({
      message: "Unauthorized to delete question for this exam",
    });
  }
};

module.exports = {
  getAllQuestions,
  getQuestionById,
  createQuestion,
  updateQuestion,
  deleteQuestion,
};
