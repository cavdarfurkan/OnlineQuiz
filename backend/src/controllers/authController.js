const User = require("../models/user");
const userRepository = require("../repositories/userRepository");

const login = async (req, res) => {
  const rows = await userRepository.getAllUsers();
  res.send(rows);
};

// const signup = (req, res) => {
//   if (!req.body.email || !req.body.password) {
//     return res.status(400).send("You must send the email and the password");
//   }

//   User.findOne({ email: req.body.email }, (err, existingUser) => {
//     if (err) {
//       return res.status(500).send("An error occurred");
//     }

//     if (existingUser) {
//       return res.status(409).send("That email is already taken");
//     }

//     const user = new User({
//       email: req.body.email,
//       password: req.body.password,
//     });

//     user.save((err) => {
//       if (err) {
//         return res.status(500).send("An error occurred");
//       }

//       return res.status(201).send("Signed up successfully");
//     });
//   });
// };

module.exports = {
  login,
  signup,
};
