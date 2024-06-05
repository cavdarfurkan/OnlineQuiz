const bcrypt = require("bcrypt");
const userRepository = require("../repositories/userRepository");
const { validationResult } = require("express-validator");

const login = async (req, res) => {
  const errors = validationResult(req).formatWith(({ msg }) => msg);
  if (!errors.isEmpty()) {
    return res.status(400).json({ errors: errors.array() });
  }

  const { email, password } = req.body;
  const user = await userRepository.getUserByEmail(email);

  if (!user || !bcrypt.compareSync(password, user.password)) {
    return res.status(401).json({ message: "Invalid email or password" });
  }

  const userRoles = await userRepository.getUserRoles(user.id);

  req.session.save(() => {
    req.session.logged_in = true;
    req.session.user = {
      id: user.id,
      email: user.email,
      firstname: user.first_name,
      lastname: user.last_name,
      roles: userRoles,
    };

    return res.status(200).json({
      user: {
        id: user.id,
        email: user.email,
        firstname: user.first_name,
        lastname: user.last_name,
        role: userRoles,
      },
      message: "Logged in successfully",
    });
  });
};

const signup = async (req, res) => {
  const errors = validationResult(req).formatWith(({ msg }) => msg);
  if (!errors.isEmpty()) {
    return res.status(400).json({ errors: errors.array() });
  }

  await userRepository.getUserByEmail(req.body.email).then(async (user) => {
    if (user) {
      return res.status(409).send("That email is already taken");
    }

    const userPassword = bcrypt.hashSync(req.body.password, 10);

    await userRepository
      .createUser(
        req.body.firstname,
        req.body.lastname,
        req.body.email,
        userPassword,
        req.body.role
      )
      .then(() => {
        return res.status(201).send("Signed up successfully");
      })
      .catch((err) => {
        console.error(err);
        return res.status(500).send(err || "An error occurred");
      });
  });
};

const logout = async (req, res) => {
  req.session.logged_in = false;
  req.session.user = null;

  req.session.destroy(() => {
    res.status(204).end();
  });
};

module.exports = {
  login,
  signup,
  logout,
};
