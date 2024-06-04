require("dotenv").config();
const express = require("express");
const auth = require("./routes/auth");

const app = express();
const PORT = process.env.PORT || 5000;

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Routes
app.use("/api/auth", auth);

app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
