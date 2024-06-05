require("dotenv").config();

const config = {
  host: process.env.DB_HOST || "localhost",
  port: process.env.DB_PORT || 3306,
  user: process.env.DB_USER || "username",
  password: process.env.DB_PASSWORD || "password",
  database: process.env.DB_NAME || "db_name",
  waitForConnections: true,
  connectionLimit: 10,
  queueLimit: 0,
};

module.exports = config;
