// NPM MODULES
const express = require("express");
const cors = require("cors");
const mongoose = require("mongoose");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
require("dotenv").config();
// MODELS
const User = require("./models/User.js");

const app = express();

app.use(cors({ credentials: true, origin: "http://localhost:3000" }));
app.use(express.json());

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
          res.cookie(process.env.JWT_COOKIE, token);
          res.json("ok");
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

app.listen(4000);
