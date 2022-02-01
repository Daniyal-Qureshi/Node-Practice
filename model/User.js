const mongoose = require("mongoose");
const bcrypt = require("bcrypt");
const userSchema = mongoose.Schema({ email: String, password: String });
userSchema.pre("save", function (next) {
  bcrypt.hash(this.password, 5, (err, hash) => {
    this.password = hash;
    next();
  });
});

module.exports = mongoose.model("user", userSchema);
