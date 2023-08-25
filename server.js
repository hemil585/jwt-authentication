const express = require("express");
const mongoose = require("mongoose");
const cookieParser = require("cookie-parser");
const authRoutes = require("./routes/authRoutes");
const morgan = require("morgan");
const { requireAuth, checkUser } = require("./middleware/authMiddleware");
require("dotenv").config();

const server = express();

// middleware
server.use(express.static("public"));
server.use(express.json());
server.use(cookieParser());

// view engine
server.set("view engine", "ejs");

// database connection
const connectToDB = (async () => {
  try {
    await mongoose.connect(process.env.MONGODB_URL, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
      useCreateIndex: true,
    });
    console.log("Connected to DB!");
  } catch (err) {
    console.log(err);
  }
})();
// routes
server.get("*", checkUser);
server.get("/", requireAuth, (req, res) => res.render("home"));
server.get("/smoothies", requireAuth, (req, res) => res.render("smoothies"));

server.use("/", authRoutes);

server.get("/set-cookies", (req, res) => {
  res.cookie("newUser", false);
  res.cookie("isEmployee", true, {
    maxAge: 1000 * 60 * 60 * 24,
    httpOnly: true,
  });

  res.send("Hello");
});

server.get("/read-cookies", (req, res) => {
  const cookies = req.cookies;
  res.json(cookies);
});

const PORT = process.env.PORT || 8080;

server.listen(PORT, () => {
  console.log(`Server is alive at http://localhost:${PORT}`);
});
