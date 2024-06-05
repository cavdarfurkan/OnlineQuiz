require("dotenv").config();

const session = {
  secret: process.env.SESSION_SECRET || "secret",
  cookie: { maxAge: 60000 },
  resave: false,
  saveUninitialized: true,
};

module.exports = session;
