const getPool = require("../utils/db");
const Option = require("../models/option");

async function getAllOptionsByQuestionId(questionId) {
  const pool = await getPool();
  const [rows] = await pool.execute(
    "SELECT * FROM options WHERE question_id = ?",
    [questionId]
  );
  return rows;
}

async function createOption(data) {
  const pool = await getPool();
  const option = new Option(
    data.option_text,
    data.question_id,
    data.is_correct
  );

  const [result] = await pool.execute(
    "INSERT INTO options (option_text, question_id, is_correct) VALUES (?, ?, ?)",
    [option.option_text, option.question_id, option.is_correct]
  );
  return result.insertId;
}

async function getOptionById(id) {
  const pool = await getPool();
  const [rows] = await pool.execute("SELECT * FROM options WHERE id = ?", [id]);
  return rows[0];
}

async function updateOption(id, clause) {
  const pool = await getPool();
  const [result] = await pool.execute(
    `UPDATE options SET ${clause} WHERE id = ?`,
    [id]
  );
  return result.affectedRows;
}

async function deleteOption(id) {
  const pool = await getPool();
  const [results] = await pool.execute("DELETE FROM options WHERE id = ?", [
    id,
  ]);
  return results.affectedRows;
}

module.exports = {
  getAllOptionsByQuestionId,
  createOption,
  getOptionById,
  updateOption,
  deleteOption,
};
