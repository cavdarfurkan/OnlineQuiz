const getPool = require("../utils/db");
const roleRepository = require("./roleRepository");

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

// async function getAllUsersByRole(role) {
//   const pool = await getPool();
//   const [rows] = await pool.execute(
//     "SELECT users.* FROM users JOIN user_roles ON users.id = user_roles.user_id JOIN roles ON user_roles.role_id = roles.id WHERE roles.role_name = ?",
//     [role]
//   );
//   return rows;
// }

module.exports = {
  getUserByEmail,
  getAllUsers,
  getUserRoles,
  createUser,
};
