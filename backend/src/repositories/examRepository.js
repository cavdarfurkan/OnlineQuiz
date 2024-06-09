const getPool = require("../utils/db");

async function getAllExamsByCourse(courseId) {
  const pool = await getPool();
  const [rows] = await pool.execute("SELECT * FROM exams WHERE course_id = ?", [
    courseId,
  ]);
  return rows;
}

async function getAllExams() {
  const pool = await getPool();
  const [rows] = await pool.execute("SELECT * FROM exams");
  return rows;
}

async function getExamById(id) {
  const pool = await getPool();
  const [rows] = await pool.execute("SELECT * FROM exams WHERE id = ?", [id]);
  return rows[0];
}

async function getStudentExamsByStudentId(studentId) {
  const pool = await getPool();
  const [rows] = await pool.execute(
    "SELECT * FROM student_exams WHERE student_id = ?",
    [studentId]
  );
  return rows;
}

async function createExam(exam) {
  const pool = await getPool();

  let query = `INSERT INTO exams (title, date, duration_min, course_id) VALUES (?, ?, ?, ?)`;
  let values = [exam.title, exam.date, exam.duration_min, exam.course_id];
  if (exam.pass_percent) {
    query = `INSERT INTO exams (title, date, duration_min, course_id, pass_percent) VALUES (?, ?, ?, ?, ?)`;
    values.push(exam.pass_percent);
  }

  const [result] = await pool.execute(query, values);
  return result.insertId;
}

async function updateExam(id, clause) {
  const pool = await getPool();
  const [result] = await pool.execute(
    `UPDATE exams SET ${clause} WHERE id = ?`,
    [id]
  );
  return result.affectedRows;
}

async function deleteExam(id) {
  const pool = await getPool();
  const [result] = await pool.execute("DELETE FROM exams WHERE id = ?", [id]);
  return result.affectedRows;
}

async function createStudentExam(studentId, examId, grade, startTime, endTime) {
  const pool = await getPool();
  await pool.execute(
    "INSERT INTO student_exams (student_id, exam_id, grade, start_time, end_time) VALUES (?, ?, ?, ?, ?)",
    [studentId, examId, grade, startTime, endTime]
  );
}

module.exports = {
  getAllExamsByCourse,
  getAllExams,
  getStudentExamsByStudentId,
  getExamById,
  createExam,
  updateExam,
  deleteExam,
  createStudentExam,
};
