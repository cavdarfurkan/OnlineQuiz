const getPool = require("../utils/db");

async function getRoleById(roleId) {
  const pool = await getPool();
  const [rows] = await pool.execute("SELECT * FROM roles WHERE id = ?", [
    roleId,
  ]);
  return rows[0];
}

async function getRoleByName(roleName) {
  const pool = await getPool();
  const [rows] = await pool.execute("SELECT * FROM roles WHERE role_name = ?", [
    roleName,
  ]);
  return rows[0];
}

module.exports = { getRoleById, getRoleByName };
