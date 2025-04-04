const mongoose = require("mongoose");
const { RecipientSchema } = require("./recepients");
const { SenderSchema } = require("./senders");

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

const InvoiceSchema = new mongoose.Schema({
  tag: String,
  description: String,
  date: Date,
  sender: SenderSchema,
  recipient: RecipientSchema,
  items: [ItemSchema],
  userId: String,
  status: {
    type: String,
    enum: INVOICE_STATUSES,
    default: INVOICE_STATUSES[0],
  },
});

const Invoice = mongoose.model("Invoice", InvoiceSchema);

module.exports = { Invoice, INVOICE_STATUSES };
