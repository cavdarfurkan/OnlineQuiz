const getPool = require("../utils/db");
const Course = require("../models/course");

async function getAllCourses() {
  const pool = await getPool();
  const [rows] = await pool.execute("SELECT * FROM courses");
  return rows;
}

async function getCourseById(id) {
  const pool = await getPool();
  const [rows] = await pool.execute("SELECT * FROM courses WHERE id = ?", [id]);
  return rows[0];
}

async function getCourseByShortName(shortName) {
  const pool = await getPool();
  const [rows] = await pool.execute(
    "SELECT * FROM courses WHERE short_name = ?",
    [shortName]
  );
  return rows[0];
}

async function getAllCoursesByTeacherId(teacherId) {
  const pool = await getPool();
  const [rows] = await pool.execute(
    "SELECT * FROM courses WHERE teacher_id = ?",
    [teacherId]
  );
  return rows;
}

async function getAllCoursesByStudentId(studentId) {
  const pool = await getPool();
  const [rows] = await pool.execute(
    "SELECT * FROM courses JOIN student_courses ON courses.id = student_courses.course_id WHERE student_courses.student_id = ?",
    [studentId]
  );
  return rows;
}

async function createCourse(
  short_name,
  name,
  description,
  start_date,
  teacherId
) {
  const course = new Course(
    short_name,
    name,
    description,
    start_date,
    teacherId
  );

  const isInvitationCodeSame = await getCourseByInvitationCode(
    course.invitation_code
  );
  if (isInvitationCodeSame) {
    return createCourse(
      course.short_name,
      course.name,
      course.description,
      course.start_date,
      course.teacher_id
    );
  }

  const pool = await getPool();
  const [result] = await pool.execute(
    "INSERT INTO courses (short_name, name, description, start_date, teacher_id, invitation_code) VALUES (?, ?, ?, ?, ?, ?)",
    [
      course.short_name,
      course.name,
      course.description,
      course.start_date,
      course.teacher_id,
      course.invitation_code,
    ]
  );
  return result.insertId;
}

async function updateCourse(id, clause) {
  const pool = await getPool();
  const [result] = await pool.execute(
    `UPDATE courses SET ${clause} WHERE id = ?`,
    [id]
  );
  return result.affectedRows;
}

async function deleteCourse(id) {
  const pool = await getPool();
  const [result] = await pool.execute("DELETE FROM courses WHERE id = ?", [id]);
  return result.affectedRows;
}

async function getCourseByInvitationCode(invitationCode) {
  const pool = await getPool();
  const [rows] = await pool.execute(
    "SELECT * FROM courses WHERE invitation_code = ?",
    [invitationCode]
  );
  return rows[0];
}

module.exports = {
  getAllCourses,
  getCourseById,
  getCourseByShortName,
  getAllCoursesByTeacherId,
  getAllCoursesByStudentId,
  createCourse,
  updateCourse,
  deleteCourse,
  getCourseByInvitationCode,
};
