const jwt = require("jsonwebtoken");
const model = require("../model/user");
const User = model.User;

const handleErrors = (err) => {
  console.log(err.message, err.code);
  let errors = { email: "", password: "" };

  if (err.message === "incorrect user") {
    errors.email = "that email is not registered";
  }

  if (err.message === "incorrect password") {
    errors.password = "that password is incorrect";
  }

  if (err.code === 11000) {
    errors.email = "that email is already registered";
  }
  // validation errors
  if (err.message.includes("User validation failed")) {
    // console.log(Object.values(err.errors));
    Object.values(err.errors).forEach(({ properties }) => {
      // console.log(properties);
      errors[properties.path] = properties.message;
    });
  }

  return errors;
};

const maxAge = 3 * 24 * 60 * 60;
const createToken = (id) => {
  return jwt.sign({ id }, process.env.JWT_SECRET_KEY, {
    expiresIn: maxAge,
  });
};

exports.signupGet = (req, res) => {
  res.render("signup");
};
exports.signupPost = async (req, res) => {
  const { email, password } = req.body;
  try {
    const user = await User.create({ email, password });
    const token = createToken(user._id);
    res.cookie("jwt", token, { httpOnly: true, maxAge: maxAge * 1000 });
    res.status(201).json({ user: user._id });
  } catch (err) {
    const errors = handleErrors(err);
    res.status(400).json(errors);
  }
};

exports.loginGet = (req, res) => {
  res.render("login");
};

exports.loginPost = async (req, res) => {
  const { email, password } = req.body;

  try {
    const user = await User.login(email, password);
    const token = createToken(user._id);
    res.cookie("jwt", token, { httpOnly: true, maxAge: maxAge * 1000 });
    res.status(200).json({ user: user._id });
  } catch (err) {
    const errors = handleErrors(err);
    res.status(400).json(errors);
  }
};

exports.logout = (req, res) => {
  res.cookie("jwt", "", { maxAge: 1 });
  res.redirect("/");
};
