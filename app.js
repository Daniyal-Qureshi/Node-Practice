const express = require("express");
const app = express();
const body_parser = require("body-parser");
const mongoose = require("mongoose");
const path = require('path')
const Product = require("./model/Product");
// const { redirect } = require("express/lib/response");
const fileUpload = require('express-fileupload')

mongoose.connect(
    "mongodb://127.0.0.1:27017/store", { useNewUrlParser: true },
    () => console.log("connected")
);

require("ejs");
app.set("view engine", "ejs");
app.use(express.static("public"));
app.use(body_parser.json());
app.use(body_parser.urlencoded({ extended: true }));
app.use(fileUpload())
const User = require("./model/User");
const { runMain } = require("module");


app.get("/signin", (req, res) => res.render("signin"));

app.get("/signup", (req, res) => res.render("signup"));

app.post("/save", async(req, res) => {
    const user = await User.create(req.body);




    console.log(user);
    res.redirect("/signin");
});



app.get("/product", (req, res) => res.render("product"))

app.get("/", async(req, res) => {
    const products = await Product.find()
    console.log("All ", products);


    res.render("home", { products })


})

app.post("/add", async(req, res) => {
    console.log(req.files);
    const image = req.files.image
    image.mv(path.resolve(__dirname, './public/img', image.name))
    await Product.create({...req.body, image: image.name })
    res.redirect("/")

})

app.post("/auth", async(req, res) => {
    const user = await User.findOne(req.body);
    if (user) res.render("home");
    else res.redirect("/signin");
});

app.listen(3000, () => {
    console.log("listing");
});