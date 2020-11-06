const mongoose = require("mongoose");

const messageSchema = mongoose.Schema({
  content: {
    type: String,
    required: true,
  },
  uuid: {
    type: String,
  },
  from: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
    required: true,
  },
  to: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
    required: true,
  },
  createdAt: {
    type: String,
    require: true,
  },
  seen: {
    type: Boolean,
    default: false,
  },
  Image: {
    path: { type: String },
    filename: { type: String },
    mimetype: { type: String },
  },
});

module.exports = mongoose.model("Message", messageSchema);
