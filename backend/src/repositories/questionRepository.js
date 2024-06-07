const getPool = require("../utils/db");
const Question = require("../models/question");

async function getAllQuestionsByExam(examId) {
  const pool = await getPool();
  const [rows] = await pool.execute(
    "SELECT * FROM question WHERE exam_id = ?",
    [examId]
  );
  return rows;
}

async function getAllQuestions() {
  const pool = await getPool();
  const [rows] = await pool.execute("SELECT * FROM question");
  return rows;
}

async function getQuestionById(id) {
  const pool = await getPool();
  const [rows] = await pool.execute("SELECT * FROM question WHERE id = ?", [
    id,
  ]);
  return rows[0];
}

async function createQuestion(data) {
  const pool = await getPool();
  const question = new Question(data.question_text, data.exam_id);

  const [result] = await pool.execute(
    "INSERT INTO question (question_text, exam_id) VALUES (?, ?)",
    [question.question_text, question.exam_id]
  );
  return result.insertId;
}

async function updateQuestion(id, clause) {
  const pool = await getPool();
  const [result] = await pool.execute(
    `UPDATE question SET ${clause} WHERE id = ?`,
    [id]
  );
  return result.affectedRows;
}

async function deleteQuestion(id) {
  const pool = await getPool();
  const [results] = await pool.execute("DELETE FROM question WHERE id = ?", [
    id,
  ]);
  return results.affectedRows;
}

module.exports = {
  getAllQuestionsByExam,
  getAllQuestions,
  getQuestionById,
  createQuestion,
  updateQuestion,
  deleteQuestion,
};
