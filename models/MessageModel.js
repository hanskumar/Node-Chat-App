const mongoose = require("mongoose");
const Schema = mongoose.Schema;


const Messageschema = new mongoose.Schema(
  {
    readBy: [{ type: Schema.Types.ObjectId, ref: 'User',required: true}],
    sender: { type: Schema.Types.ObjectId, ref: 'User',required: true},
    message:  { type: String, required:true},
    media:{ type: String,  default:'' }, // if user send media attachement save in this field
    chat:{ type: Schema.Types.ObjectId, ref: 'Chat',required: true},
  },{timestamps: true}
);

module.exports = mongoose.model("Message", Messageschema);