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

async function getUpcomingCourses(studentId, today) {
  const pool = await getPool();

  const [rows] = await pool.execute(
    `SELECT * FROM courses WHERE start_date > ? AND id NOT IN (SELECT course_id FROM student_courses WHERE student_id = ?) ORDER BY start_date ASC`,
    [today, studentId]
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
  const connection = await pool.getConnection();

  await connection.beginTransaction();

  try {
    await connection.execute(
      "DELETE FROM student_courses WHERE course_id = ?",
      [id]
    );

    const courseExams = await connection.execute(
      "SELECT * FROM exams WHERE course_id = ?",
      [id]
    );
    for (const courseExam of courseExams[0]) {
      await connection.execute("DELETE FROM student_exams WHERE exam_id = ?", [
        courseExam.id,
      ]);
    }
    await connection.execute("DELETE FROM exams WHERE course_id = ?", [id]);

    await connection.execute("DELETE FROM courses WHERE id = ?", [id]);

    await connection.commit();
    return Promise.resolve();
  } catch (error) {
    await connection.rollback();
    return Promise.reject(error);
  }
}

async function getCourseByInvitationCode(invitationCode) {
  const pool = await getPool();
  const [rows] = await pool.execute(
    "SELECT * FROM courses WHERE invitation_code = ?",
    [invitationCode]
  );
  return rows[0];
}

async function getStudentsByCourseId(courseId) {
  const pool = await getPool();
  const [rows] = await pool.execute(
    "SELECT * FROM users JOIN student_courses ON users.id = student_courses.student_id WHERE student_courses.course_id = ?",
    [courseId]
  );
  return rows;
}

async function joinCourse(studentId, courseId) {
  const pool = await getPool();
  const [result] = await pool.execute(
    "INSERT INTO student_courses (student_id, course_id) VALUES (?, ?)",
    [studentId, courseId]
  );
  return result.insertId;
}

module.exports = {
  getAllCourses,
  getCourseById,
  getCourseByShortName,
  getAllCoursesByTeacherId,
  getAllCoursesByStudentId,
  getUpcomingCourses,
  createCourse,
  updateCourse,
  deleteCourse,
  getCourseByInvitationCode,
  getStudentsByCourseId,
  joinCourse,
};
