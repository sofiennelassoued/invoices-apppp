const mongoose = require("mongoose");

const SenderSchema = new mongoose.Schema(
  {
    name: String,
    email: String,
    address: String,
    vat: Number,
    vatId: String,
    insee: String, // French SIRET
    country: String,
    language: String,
    currency: String,
    pictureUrl: String,
    userId: String,
  },
  { timestamps: true }
);

const Sender = mongoose.model("Sender", SenderSchema);

module.exports = {
  Sender,
  SenderSchema,
};
