const mongoose = require("mongoose");

const SenderSchema = new mongoose.Schema({
  name: String,
  address: String,
  vat: Number,
  userId: String,
});

const Sender = mongoose.model("Sender", SenderSchema);

module.exports = {
  Sender,
  SenderSchema
};
