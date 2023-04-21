// NPM MODULES
const express = require("express");
const cors = require("cors");
const mongoose = require("mongoose");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const cookieParser = require("cookie-parser");
require("dotenv").config();
const multer = require("multer");
const fs = require("fs");
const path = require("path");

// MODELS
const User = require("./models/User.js");
const Post = require("./models/Post.js");

// 'APP': express server
const app = express();

// MIDDLEWARES
app.use(cors({ credentials: true, origin: "http://localhost:3000" }));
app.use(express.json());
app.use(cookieParser());
const uploadMiddleware = multer({ dest: "uploads/" });

// BCRYPT
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

app.post("/post", uploadMiddleware.single("image"), async (req, res) => {
  const { originalname, path } = req.file;
  const parts = originalname.split(".");
  const ext = parts[parts.length - 1];
  const newPath = `${path}.${ext}`;
  fs.renameSync(path, newPath);

  const { token } = req.cookies;

  jwt.verify(token, process.env.JWT_SECRET, {}, async (err, info) => {
    if (err) throw err;
    const { title, summary, content } = req.body;
    const postDocument = await Post.create({
      title,
      summary,
      content,
      cover: newPath,
      author: info.id,
    });

    res.json(postDocument);
  });
});

app.put("/post/:id", uploadMiddleware.single("image"), async (req, res) => {
  const { title, summary, content } = req.body;
  const { token } = req.cookies;
  const { id } = req.params;
  let newPath = null;
  jwt.verify(token, process.env.JWT_SECRET, {}, async (err, info) => {
    if (err) throw err;
    const postDocument = await Post.findById(id);
    const isAuthor =
      JSON.stringify(postDocument.author) === JSON.stringify(info.id);
    if (!isAuthor) {
      return res.sendStatus(400);
    }

    if (req.file) {
      const { originalname, path: filePath } = req.file;
      const parts = originalname.split(".");
      const ext = parts[parts.length - 1];
      newPath = `${filePath}.${ext}`;
      fs.renameSync(
        path.join(__dirname, filePath),
        path.join(__dirname, newPath)
      );
    }

    await postDocument.updateOne({
      title,
      summary,
      content,
      cover: newPath || postDocument.cover,
    });

    res.json("ok");
  });
});

app.get("/posts", async (req, res) => {
  const posts = await Post.find({})
    .populate("author", ["username"])
    .sort({ createdAt: -1 })
    .limit(10);
  res.json(posts);
});

app.use("/uploads", express.static(__dirname + "/uploads"));

app.get("/post/:id", async (req, res) => {
  const { id } = req.params;
  const postDocument = await Post.findById(id).populate("author", ["username"]);
  res.json(postDocument);
});

app.listen(4000);
