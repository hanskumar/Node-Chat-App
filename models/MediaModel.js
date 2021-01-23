const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const MediaSchema = new mongoose.Schema(
  {
    chunkSize: {type: String},
    uploadDate:{type: Date, default: Date.now},
    length:{type: String},
    filename:{type: String},
    mimetype: {type:String},
    chat:{ type: Schema.Types.ObjectId, ref: 'Chat',required: true},
  },{timestamps: true}
);

module.exports = mongoose.model("Media", MediaSchema);