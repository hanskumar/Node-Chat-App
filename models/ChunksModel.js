const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const ChunksSchema = new mongoose.Schema(
  {
    files_id:{type: String},
    data:{type: String},
    chat:{ type: Schema.Types.ObjectId, ref: 'Chat',required: true},
  },{timestamps: true}
);

module.exports = mongoose.model("Chunks", ChunksSchema);