const getPool = require("../utils/db");
const roleRepository = require("./roleRepository");
const courseRepository = require("./courseRepository");

async function getUserById(id) {
  const pool = await getPool();
  const [rows] = await pool.execute("SELECT * FROM users WHERE id = ?", [id]);
  return rows[0];
}

async function getUserByEmail(email) {
  const pool = await getPool();
  const [rows] = await pool.execute("SELECT * FROM users WHERE email = ?", [
    email,
  ]);
  return rows[0];
}

async function getAllUsers() {
  const pool = await getPool();
  const [rows] = await pool.execute("SELECT * FROM users");
  return rows;
}

async function getUserRoles(userId) {
  const pool = await getPool();
  const [rows] = await pool.execute(
    "SELECT roles.role_name FROM roles JOIN user_roles ON roles.id = user_roles.role_id WHERE user_roles.user_id = ?",
    [userId]
  );
  return rows.map((row) => row.role_name);
}

async function createUser(firstName, lastName, email, password, role) {
  const pool = await getPool();
  const connection = await pool.getConnection();

  await connection.beginTransaction();

  const [{ insertId }] = await connection.execute(
    "INSERT INTO users (first_name, last_name, email, password) VALUES (?, ?, ?, ?)",
    [firstName, lastName, email, password]
  );

  if (!insertId) {
    await connection.rollback();
    return Promise.reject();
  }

  const userRole = await roleRepository.getRoleByName(role);
  if (!userRole) {
    await connection.rollback();
    return Promise.reject("Role not found");
  }

  const roleId = userRole.id;

  await connection
    .execute("INSERT INTO user_roles (user_id, role_id) VALUES (?, ?)", [
      insertId,
      roleId,
    ])
    .then(async () => {
      await connection.commit();
      return Promise.resolve();
    })
    .catch(async (error) => {
      console.error(error);
      await connection.rollback();
      return Promise.reject(error);
    });
}

async function updateUser(id, clause) {
  const pool = await getPool();
  const [result] = await pool.execute(
    `UPDATE users SET ${clause} WHERE id = ?`,
    [id]
  );
  return result.affectedRows;
}

async function deleteUser(id) {
  const pool = await getPool();
  const connection = await pool.getConnection();

  await connection.beginTransaction();

  try {
    await connection.execute(
      "UPDATE courses SET is_archived = 1 WHERE teacher_id = ?",
      [id]
    );

    // Orphane the courses that the user is teaching
    const user = await getUserById(id);
    if (!user) {
      await connection.rollback();
      return Promise.reject("User not found");
    }

    const courses = await courseRepository.getAllCoursesByTeacherId(id);
    for (const course of courses) {
      await connection.execute(
        "UPDATE courses SET teacher_id = NULL WHERE id = ?",
        [course.id]
      );
    }

    await connection.execute("DELETE FROM user_roles WHERE user_id = ?", [id]);
    await connection.execute("DELETE FROM users WHERE id = ?", [id]);

    await connection.commit();
    return Promise.resolve();
  } catch (error) {
    await connection.rollback();
    return Promise.reject(error);
  }
}

module.exports = {
  getUserById,
  getUserByEmail,
  getAllUsers,
  getUserRoles,
  createUser,
  updateUser,
  deleteUser,
};
