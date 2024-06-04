const getPool = require("../utils/db");

async function getAllUsers() {
  const pool = await getPool();
  const [rows] = await pool.execute("SELECT * FROM courses");
  return rows;
}

module.exports = { getAllUsers };
