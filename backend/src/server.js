require("dotenv").config();
const express = require("express");
const session = require("express-session");
const sessionConfig = require("./config/session");

const authRouter = require("./routes/auth");
const courseRouter = require("./routes/course");
const { authenticate } = require("./middleware/authMiddlewares");

const app = express();
const PORT = process.env.PORT || 5000;

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(session(sessionConfig));
app.use(authenticate);

// Routes
app.use("/api/auth", authRouter);
app.use("/api/courses", courseRouter);

app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
