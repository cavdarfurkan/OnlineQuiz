const optionRepository = require("../repositories/optionRepository");
const questionRepository = require("../repositories/questionRepository");
const examRepository = require("../repositories/examRepository");
const courseRepository = require("../repositories/courseRepository");
const { validationResult, matchedData } = require("express-validator");

const getAllOptionsByQuestionId = async (req, res) => {
  const errors = validationResult(req).formatWith(({ msg }) => msg);
  if (!errors.isEmpty()) {
    return res.status(400).json({ errors: errors.array() });
  }

  const { questionId } = matchedData(req);
  const options = await optionRepository.getAllOptionsByQuestionId(questionId);
  res.json(options);
};

const createOption = async (req, res) => {
  const errors = validationResult(req).formatWith(({ msg }) => msg);
  if (!errors.isEmpty()) {
    return res.status(400).json({ errors: errors.array() });
  }

  const { question_id, option_text, is_correct } = matchedData(req);
  const question = await questionRepository.getQuestionById(question_id);
  const exam = await examRepository.getExamById(question.exam_id);
  const course = await courseRepository.getCourseById(exam.course_id);

  // Admin can create options for any question
  if (req.session.user.role === "admin") {
    const optionId = await optionRepository.createOption({
      question_id,
      option_text,
      is_correct,
    });
    return res.status(201).json({ id: optionId });
  }

  // Teachers can create options only for their questions
  if (course.teacher_id === req.session.user.id) {
    const optionId = await optionRepository.createOption({
      question_id,
      option_text,
      is_correct,
    });
    return res.status(201).json({ id: optionId });
  } else {
    return res
      .status(403)
      .json({ message: "Unauthorized to create option for this question" });
  }
};

const updateOption = async (req, res) => {
  const errors = validationResult(req).formatWith(({ msg }) => msg);
  if (!errors.isEmpty()) {
    return res.status(400).json({ errors: errors.array() });
  }

  const { id, ...data } = matchedData(req);
  const option = await optionRepository.getOptionById(id);
  if (!option) {
    return res.status(404).json({ message: "Option not found" });
  }

  let clause = "";
  for (const key in data) {
    if (clause !== "") clause += ", ";
    clause += `${key} = '${data[key]}'`;
  }
  if (clause === "") {
    return res.status(400).json({ message: "No fields to update" });
  }

  // Admin can update any option
  if (req.session.user.role === "admin") {
    const affectedRows = await optionRepository.updateOption(id, clause);
    if (!affectedRows) {
      return res.status(404).json({ message: "Option not found" });
    }
    return res.json({ message: "Option updated" });
  }

  // Teachers can update only their options
  const question = await questionRepository.getQuestionById(option.question_id);
  const exam = await examRepository.getExamById(question.exam_id);
  const course = await courseRepository.getCourseById(exam.course_id);

  if (course.teacher_id === req.session.user.id) {
    const affectedRows = await optionRepository.updateOption(id, clause);
    if (!affectedRows) {
      return res.status(404).json({ message: "Option not found" });
    }
    return res.json({ message: "Option updated" });
  } else {
    return res
      .status(403)
      .json({ message: "Unauthorized to create option for this question" });
  }
};

const deleteOption = async (req, res) => {
  const errors = validationResult(req).formatWith(({ msg }) => msg);
  if (!errors.isEmpty()) {
    return res.status(400).json({ errors: errors.array() });
  }

  const { id } = matchedData(req);
  const option = await optionRepository.getOptionById(id);
  if (!option) {
    return res.status(404).json({ message: "Option not found" });
  }

  // Admin can delete any option
  if (req.session.user.role === "admin") {
    const affectedRows = await optionRepository.deleteOption(id);
    if (!affectedRows) {
      return res.status(404).json({ message: "Option not found" });
    }
    return res.json({ message: "Option deleted" });
  }

  // Teachers can delete options only for their questions
  const question = await questionRepository.getQuestionById(option.question_id);
  const exam = await examRepository.getExamById(question.exam_id);
  const course = await courseRepository.getCourseById(exam.course_id);

  if (course.teacher_id === req.session.user.id) {
    const affectedRows = await optionRepository.deleteOption(id);
    if (!affectedRows) {
      return res.status(404).json({ message: "Option not found" });
    }
    return res.json({ message: "Option deleted" });
  } else {
    return res
      .status(403)
      .json({ message: "Unauthorized to delete option for this question" });
  }
};

module.exports = {
  getAllOptionsByQuestionId,
  createOption,
  updateOption,
  deleteOption,
};
