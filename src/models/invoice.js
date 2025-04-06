const mongoose = require("mongoose");

const INVOICE_STATUSES = [
  "Draft",
  "Pending",
  "Paid",
  "Partial Payment",
  "Overdue",
  "Cancelled",
  "Rejected",
  "Refunded",
];

const ItemSchema = new mongoose.Schema({
  label: String,
  quantity: Number,
  unitPrice: Number,
  vat: Number,
});

const InvoiceSchema = new mongoose.Schema(
  {
    tag: String,
    description: String,
    date: Date,
    sender: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Sender",
      required: true,
    },
    recipient: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Recipient",
      required: true,
    },
    items: [ItemSchema],
    userId: String,
    status: {
      type: String,
      enum: INVOICE_STATUSES,
      default: INVOICE_STATUSES[0],
    },
  },
  { timestamps: true }
);

const Invoice = mongoose.model("Invoice", InvoiceSchema);

module.exports = { Invoice, INVOICE_STATUSES };
