const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const gravatar = require("gravatar");
const path = require("path");
const fs = require("fs/promises");
const jimp = require("jimp");

const { User } = require("../models/user");
const HttpErr = require("../helpers/HttpError");

const { SECRET_KEY } = process.env;

const avatarsDir = path.join(__dirname, "../", "public", "avatars");

const register = async (req, res, next) => {
  try {
    const { email, password } = req.body;
    const user = await User.findOne({ email });

    if (user) {
      throw HttpErr(409, "Email in use");
    }
    const hashPass = await bcrypt.hash(password, 10);
    const avatarURL = gravatar.url(email);

    const newUser = await User.create({
      ...req.body,
      password: hashPass,
      avatarURL,
    });
    res.status(201).json(newUser);
  } catch (err) {
    next(err);
  }
};

const login = async (req, res, next) => {
  try {
    const { email, password } = req.body;

    const user = await User.findOne({ email });
    if (!user) {
      throw HttpErr(401, "Email or password is wrong");
    }

    const passCompare = await bcrypt.compare(password, user.password);
    if (!passCompare) {
      throw HttpErr(401, "Email or password is wrong");
    }

    const payload = {
      id: user._id,
    };

    const token = await jwt.sign(payload, SECRET_KEY, { expiresIn: "23h" });
    await User.findByIdAndUpdate(user._id, { token });
    res.json({ token });
  } catch (err) {
    console.log(err.message);
    next(HttpErr(401, "Email or password is wrong"));
  }
};

const getCurrent = async (req, res, next) => {
  try {
    const { email, subscription } = req.user;

    res.json({
      email,
      subscription,
    });
  } catch (err) {
    next(HttpErr(401, "Not authorized"));
  }
};

const logout = async (req, res, next) => {
  try {
    const { _id } = req.user;
    await User.findByIdAndUpdate(_id, { token: null });

    res.status(204).json({ message: "No Content" });
  } catch (err) {
    next(HttpErr(401, "Not authorized"));
  }
};

const updateUserSubscription = async (req, res, next) => {
  try {
    const { email } = req.body;
    const user = await User.findOne({ email });
    if (!user) {
      throw HttpErr(404, "Not found");
    }
    const result = await User.findByIdAndUpdate(user._id, req.body, {
      new: true,
    });
    if (!result) {
      throw HttpErr(404, "Not found");
    }
    const { _id, subscription } = result;
    res.json({ _id, email, subscription });
  } catch (err) {
    next(HttpErr(404, "Not found"));
  }
};

const updateAvatar = async (req, res, next) => {
  try {
    const { _id } = req.user;
    const { path: tempUpload, originalname } = req.file;

    // зміна розміру аватара
    const passAvatar = await jimp.read(tempUpload);
    await passAvatar.resize(250, jimp.AUTO);
    await passAvatar.writeAsync(tempUpload);
    //
    const filename = `${_id}_${originalname}`;
    const resultUpload = path.join(avatarsDir, filename);
    await fs.rename(tempUpload, resultUpload);
    const avatarURL = path.join("avatars", filename);
    await User.findByIdAndUpdate(_id, { avatarURL });
    res.json({
      avatarURL,
    });
  } catch (err) {
    next(HttpErr(401, "Not authorized"));
  }
};

module.exports = {
  register,
  login,
  getCurrent,
  logout,
  updateUserSubscription,
  updateAvatar,
};
