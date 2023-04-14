// NPM MODULES
const express = require("express");
const cors = require("cors");
const mongoose = require("mongoose");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const cookieParser = require("cookie-parser");
require("dotenv").config();
// MODELS
const User = require("./models/User.js");

const app = express();

app.use(cors({ credentials: true, origin: "http://localhost:3000" }));
app.use(express.json());
app.use(cookieParser());

const salt = bcrypt.genSaltSync(10);

mongoose.connect(process.env.MONGO_URI);

app.post("/register", async (req, res) => {
  const { username, password } = req.body;
  try {
    const userDocument = await User.create({
      username,
      password: bcrypt.hashSync(password, salt),
    });
    res.json(userDocument);
  } catch (e) {
    res.status(400).json(e);
  }
});

app.post("/login", async (req, res) => {
  const { username, password } = req.body;
  try {
    const userDocument = await User.findOne({ username });
    const isPasswordOk = bcrypt.compareSync(password, userDocument.password);
    if (isPasswordOk) {
      // logged in
      jwt.sign(
        { username, id: userDocument.id },
        process.env.JWT_SECRET,
        {},
        (err, token) => {
          if (err) throw err;
          res.cookie("token", token);
          res.json({
            id: userDocument._id,
            username,
          });
        }
      );
      // res.json()
    } else {
      // incorrect password
      res.status(400).json("Wrong password!");
    }
  } catch (e) {
    console.log(e);
    res.status(400).json(e);
  }
});

app.get("/profile", (req, res) => {
  const { token } = req.cookies;
  if (token) {
    jwt.verify(token, process.env.JWT_SECRET, {}, (err, info) => {
      if (err) throw err;
      res.json(info);
    });
  } else {
    res.sendStatus(400);
  }
});

app.post("/logout", (req, res) => {
  res.cookie("token", "");
  res.json("ok");
});

app.listen(4000);
