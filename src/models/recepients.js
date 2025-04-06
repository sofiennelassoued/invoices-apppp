const mongoose = require("mongoose");

const RecipientSchema = new mongoose.Schema(
  {
    name: String,
    address: String,
    vat: Number,
    email: String,
    userId: String,
  },
  { timestamps: true }
);

const Recipient = mongoose.model("Recipient", RecipientSchema);

module.exports = {
  Recipient,
  RecipientSchema,
};
