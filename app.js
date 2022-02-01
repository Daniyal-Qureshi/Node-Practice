const express = require("express");
const app = express();
const body_parser = require("body-parser");
const mongoose = require("mongoose");
const path = require("path");
const Product = require("./model/Product");
const session = require("express-session");

// const { redirect } = require("express/lib/response");
const fileUpload = require("express-fileupload");
const bcrypt = require("bcrypt");
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
app.use(fileUpload());
app.use(session({ secret: "2323", saveUninitialized: true, resave: true }));
const User = require("./model/User");
const authentication = require("./middleware/authentication");

app.get("/signin", (req, res) => res.render("signin"));

app.get("/signup", (req, res) => res.render("signup"));

app.post("/save", async (req, res) => {
  const user = await User.create(req.body);

  console.log(user);
  res.redirect("/signin");
});

app.get("/product", (req, res) => res.render("product"));

app.get("/", authentication, async (req, res) => {
  const products = await Product.find();
  console.log("All ", products);

  res.render("home", { products });
});

app.post("/add", async (req, res) => {
  console.log(req.files);
  const image = req.files.image;
  image.mv(path.resolve(__dirname, "./public/img", image.name));
  await Product.create({ ...req.body, image: image.name });
  res.redirect("/");
});

app.post("/auth", async (req, res) => {
  const user = await User.findOne({ email: req.body.email });
  if (user) {
    bcrypt.compare(req.body.password, user.password, (err, same) => {
      if (same) {
        req.session.userid = user._id;

        console.log(req.session);
        res.redirect("/");
      } else res.redirect("/signin");
    });
  } else res.redirect("/signin");
});

app.listen(3000, () => {
  console.log("listing");
});
