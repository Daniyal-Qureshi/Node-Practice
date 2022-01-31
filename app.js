const express = require("express");
const app = express();
const body_parser = require("body-parser");
const mongoose = require("mongoose");

mongoose.connect(
  "mongodb://127.0.0.1:27017/store",
  { useNewUrlParser: true },
  () => console.log("connected")
);

require("ejs");
app.set("view engine", "ejs");
app.use(express.static("public"));
app.use(body_parser.json());
app.use(body_parser.urlencoded({ extended: true }));

const User = require("./model/User");

app.get("/signin", (req, res) => res.render("signin"));

app.get("/signup", (req, res) => res.render("signup"));

app.post("/save", async (req, res) => {
  const user = await User.create(req.body);
  console.log(user);
  res.redirect("/signin");
});

app.post("/auth", async (req, res) => {
  const user = await User.findOne(req.body);
  if (user) res.render("home");
  else res.redirect("/signin");
});

app.listen(3000, () => {
  console.log("listing");
});
