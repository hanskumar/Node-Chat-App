const mongoose = require("mongoose");

const userSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: "Name is required!",
    },
    username: {
      type: String,
      required: "username is required!",
    },
    email: {
      type: String,
      required: "Email is required!",
    },
    password: {
      type: String,
      required: "Password is required!",
    },
    pofile_pic: {
      type: String
    },
    online_status: {
      type: String
    }
  },
  {
    timestamps: true,
  }
);

module.exports = mongoose.model("User", userSchema);