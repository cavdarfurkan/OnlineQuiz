const userRepository = require("../repositories/userRepository");
const { validationResult, matchedData } = require("express-validator");

const getUserById = async (req, res) => {
  const errors = validationResult(req).formatWith(({ msg }) => msg);
  if (!errors.isEmpty()) {
    return res.status(400).json({ errors: errors.array() });
  }

  const user = await userRepository.getUserById(req.params.id);
  if (!user) {
    return res.status(404).json({ message: "User not found" });
  }
  return res.status(200).json(user);
};

const getAllUsers = async (req, res) => {
  const users = await userRepository.getAllUsers();
  return res.status(200).json(users);
};

const updateUser = async (req, res) => {
  const errors = validationResult(req).formatWith(({ msg }) => msg);
  if (!errors.isEmpty()) {
    return res.status(400).json({ errors: errors.array() });
  }

  const data = matchedData(req);

  if (req.session.user.role !== "admin") {
    const user = await userRepository.getUserById(data.id);
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }
    if (req.session.user.id !== user.id) {
      return res.status(403).json({ message: "Unauthorized" });
    }
  }

  let clause = "";
  for (const field of Object.keys(data)) {
    if (field === "id") continue;
    if (clause !== "") clause += ", ";
    clause += `${field} = '${data[field]}'`;
  }

  if (clause === "") {
    return res.status(400).json({ message: "No fields provided" });
  }

  const updatedUser = await userRepository.updateUser(data.id, clause);
  if (!updatedUser) {
    return res.status(404).json({ message: "User not found" });
  }

  return res.status(200).json({ message: "User updated" });
};

const deleteUser = async (req, res) => {
  const errors = validationResult(req).formatWith(({ msg }) => msg);
  if (!errors.isEmpty()) {
    return res.status(400).json({ errors: errors.array() });
  }

  // If the user is not an admin, they can only delete their own account
  if (req.session.user.role !== "admin") {
    if (req.session.user.id != req.params.id) {
      return res.status(403).json({ message: "Forbidden" });
    }

    // User self delete
    return await userRepository
      .deleteUser(req.params.id)
      .then(() => {
        req.session.logged_in = false;
        req.session.user = null;

        req.session.destroy(() => {
          return res.status(204).end();
        });
      })
      .catch((error) => {
        console.error(error);
        return res.status(500).json({ message: "Internal server error" });
      });
  } else {
    // Admin self delete
    if (req.session.user.id == req.params.id) {
      return await userRepository
        .deleteUser(req.params.id)
        .then(() => {
          req.session.logged_in = false;
          req.session.user = null;

          req.session.destroy(() => {
            return res.status(204).end();
          });
        })
        .catch((error) => {
          console.error(error);
          return res.status(500).json({ message: "Internal server error" });
        });
    }
  }

  // Admin delete other user
  const user = await userRepository.getUserById(req.params.id);
  if (!user) {
    return res.status(404).json({ message: "User not found" });
  }

  // Admin delete
  await userRepository
    .deleteUser(req.params.id)
    .then(() => {
      return res.status(200).json({ message: "User deleted" });
    })
    .catch((error) => {
      console.error(error);
      return res.status(500).json({ message: "Internal server error" });
    });
};

module.exports = {
  getUserById,
  getAllUsers,
  updateUser,
  deleteUser,
};
