const mongoose = require("mongoose");
const ProductSchema = mongoose.Schema({ name: String, company: String, price: Number, image: String, });
module.exports = mongoose.model("product", ProductSchema);