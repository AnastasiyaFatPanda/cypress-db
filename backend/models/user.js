const mongoose = require("mongoose");
const uniqueValidator = require("mongoose-unique-validator");

const userSchema = new mongoose.Schema(
  {
    // unique will not push an error, only required
    email: { type: String, required: true, unique: true },
    name: String,
    age: Number,
  },
  { timestamps: true }
);

// because of this, we will have error
userSchema.plugin(uniqueValidator);

module.exports = mongoose.model("User", userSchema);