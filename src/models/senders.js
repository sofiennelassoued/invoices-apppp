const mongoose = require("mongoose");

const SenderSchema = new mongoose.Schema(
  {
    name: String,
    address: String,
    vat: Number,
    userId: String,
  },
  { timestamps: true }
);

const Sender = mongoose.model("Sender", SenderSchema);

module.exports = {
  Sender,
  SenderSchema,
};
