const mongoose = require("mongoose");

const userSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
      trim:true
    },
    username: {
      type: String,
      required: true,
      trim:true
    },
    email: {
      type: String,
      trim:true,
    },
    password: {
      type: String,
      required: "Password is required!",
    },
    pofile_pic: {
      type: String,
      default:'/images/user-default.png'
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