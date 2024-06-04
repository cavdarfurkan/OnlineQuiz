const mysql = require("mysql2/promise");
const config = require("../config/db");

let _pool;
const getPool = async () => {
  if (!_pool) {
    await _createDatabase();
    _pool = mysql.createPool(config);
    console.log("Connected to database");
  }

  return _pool;
};

const _createDatabase = async () => {
  const connection = await mysql.createConnection({
    host: config.host,
    port: config.port,
    user: config.user,
    password: config.password,
  });

  const query = `CREATE DATABASE IF NOT EXISTS ${config.database}`;
  await connection.execute(query);
  await connection.end();

  console.log(`Database ${config.database} created`);
};

module.exports = getPool;
