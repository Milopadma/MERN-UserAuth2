const express = require("express");
const app = express();
const cors = require("cors");
const mongoose = require("mongoose");
const User = require("./models/user_model");
const jwt = require("jsonwebtoken");
const bcrypt = require("bcryptjs");

require("dotenv/config");

//middleware
app.use(cors());
app.use(express.json()); //parse body to json

//connect to db
mongoose.connect(
  "" + process.env.DB_CONNECTION,
  { connectTimeoutMS: 1000 },
  () => console.log("connected to db")
);

app.post("/api/register", async (req, res) => {
  console.log(req.body);
  try {
    const newPassword = await bcrypt.hash(req.body.password, 10);
    await User.create({
      name: req.body.name,
      email: req.body.email,
      password: newPassword, //store the hashed password to the database
    });
    res.json({ status: "ok" });
  } catch (err) {
    console.log(err);
    res.json({ status: "error", error: "Duplicate email" });
  }
});

app.post("/api/login", async (req, res) => {
  const user = await User.findOne({
    email: req.body.email,
  });

  if (!user) {
    res.json({ status: "error", error: "Invalid email or password" });
  }

  const isPasswordValid = await bcrypt.compare(req.body.password, user.password);

  if (isPasswordValid) {
    const token = jwt.sign(
      {
        name: user.name,
        email: user.email,
      },
      process.env.TOKEN_SECRET
    );

    return res.json({ status: "ok", user: token });
  } else {
    return res.json({ status: "error", user: false });
  }
});

app.get("/api/quote", async (req, res) => {
const token = req.headers["x-access-token"];
  try {
    const decoded = jwt.verify(token, process.env.TOKEN_SECRET);
    const email = decoded.email;
    const user = await User.findOne({ email: email });

    return res.json({ status: "ok", quote: user.quote });
  } catch (err) {
    console.log(err);
    return res.json({ status: "error", error: "invalid token" });
  }
});

app.post("/api/quote", async (req, res) => {
  const token = req.headers["x-access-token"];
  try {
    const decoded = jwt.verify(token, process.env.TOKEN_SECRET);
    const email = decoded.email;
    await User.updateOne(
      { email: email },
      { $set: { quote: req.body.quote } }
    );

    return res.json({ status: "ok"});
  } catch (err) {
    console.log(err);
    return res.json({ status: "error", error: "invalid token" });
  }
});

app.listen(1337, () => {
  console.log("listening on port 1337");
});
