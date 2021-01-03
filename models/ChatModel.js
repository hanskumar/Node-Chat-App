const mongoose = require("mongoose");

const ChatSchema = new mongoose.Schema({
  from_id: {
    type: String,
    required: "from_id is required!",
    ref: 'User',
  },
  to_id: {
    type: String,
    required: "to_id is required!",
    ref: 'User',
  },
  msg_status: {
    type: String,
    required: "msg_status is required!",
    default: 0
  },
  txt_msg: {
    type: String,
    required: "msg_status is required!",
  },
  date_time: { type: Date, default: Date.now },
});

module.exports = mongoose.model("Chat", ChatSchema);