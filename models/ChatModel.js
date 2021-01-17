const mongoose = require("mongoose");
const Schema = mongoose.Schema;
//mongoose.set('debug', true);
const ChatSchema = new mongoose.Schema(
  {
    isGroupChat: {
      type: Boolean,
      default:false
    },
    users:[{ type: Schema.Types.ObjectId, ref: 'User',required: true}],
    latestMessage:  {
        type: String,
        default:'Dummy Message'
    },
  },{timestamps: true}
);

module.exports = mongoose.model("Chat", ChatSchema);