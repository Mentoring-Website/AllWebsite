const mongoose = require("mongoose");
const { Schema } = mongoose;
const ReplieSchema = new Schema(
  {
    mentorId: {
      type: mongoose.Schema.Types.ObjectId,
      require: true,
    },
    commentId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Comment",
      require: true,
    },
    desc: {
      type: String,
      require: true,
    },
  },
  {
    timestamps: true,
  }
);
const Replie = mongoose.model("Replie", ReplieSchema);
module.exports = Replie;
