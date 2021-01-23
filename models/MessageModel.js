const mongoose = require("mongoose");
const Schema = mongoose.Schema;


const Messageschema = new mongoose.Schema(
  {
    readBy: [{ type: Schema.Types.ObjectId, ref: 'User',required: true}],
    sender: { type: Schema.Types.ObjectId, ref: 'User',required: true},
    message:  { type: String},
    media:{ type: String,  default:'text' }, // if user send media attachement save in this field
    media_content:Buffer,
    chat:{ type: Schema.Types.ObjectId, ref: 'Chat',required: true},
  },{timestamps: true}
);

module.exports = mongoose.model("Message", Messageschema);