const bcrypt = require("bcrypt");
const userRepository = require("../repositories/userRepository");

const authenticate = async (req, res, next) => {
  const allowedRoutes = ["/api/auth/login", "/api/auth/signup", "/"];

  if (allowedRoutes.includes(req.path)) return next();

  if (req.session.user) next();
  else res.status(401).send({ message: "Unauthorized, please login" });
};

const authorize = (roles) => async (req, res, next) => {
  const user = req.session.user;

  if (!user) {
    return res.status(401).send({ message: "Unauthorized" });
  }

  // const userRoles = await userRepository.getUserRoles(user.id);
  // roles.some((role) => userRoles.includes(role))
  //   ? next()
  //   : res.status(403).send({ message: "Forbidden" });

  if (roles.includes(user.role)) {
    next();
  } else {
    res.status(403).send({ message: "Forbidden" });
  }
};

module.exports = {
  authenticate,
  authorize,
};
