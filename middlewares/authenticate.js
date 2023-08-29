const jwt = require("jsonwebtoken");
const HttpErr = require("../helpers/HttpError");
const { SECRET_KEY } = process.env;
const { User } = require("../models/user");

const authenticate = async (req, res, next) => {
  const { authorization = "" } = req.headers;
  const [bearer, token] = authorization.split(" ");
  if (bearer !== "Bearer") {
    next(HttpErr(401, "Unauthorized"));
  }
  try {
    const { id } = jwt.verify(token, SECRET_KEY);
    const user = await User.findById(id);
    if (!user || !user.token || user.token !== token) {
      next(HttpErr(404, "User not found"));
    }
    req.user = user;
    next();
  } catch (err) {
    next(HttpErr(401, "Unauthorized"));
  }
};

module.exports = authenticate;
