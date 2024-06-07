require("dotenv").config();
const express = require("express");
const session = require("express-session");
const sessionConfig = require("./config/session");
const { authenticate } = require("./middleware/authMiddlewares");

const authRouter = require("./routes/auth");
const courseRouter = require("./routes/course");
const userRouter = require("./routes/user");
const examRouter = require("./routes/exam");
const questionRouter = require("./routes/question");
const optionRouter = require("./routes/option");

const app = express();
const PORT = process.env.PORT || 5000;

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(session(sessionConfig));
app.use(authenticate);

// Routes
app.use("/api/auth", authRouter);
app.use("/api/courses", courseRouter);
app.use("/api/users", userRouter);
app.use("/api/exams", examRouter);
app.use("/api/questions", questionRouter);
app.use("/api/options", optionRouter);

app.get("/", (req, res) => {
  res.send("Hello World!");
});

app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
