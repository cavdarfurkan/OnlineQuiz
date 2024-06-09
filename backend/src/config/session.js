require("dotenv").config();

const session = {
  secret: process.env.SESSION_SECRET || "secret",
  // cookie: {
  //   httpOnly: false,
  // },
  resave: false,
  saveUninitialized: true,
};

module.exports = session;
