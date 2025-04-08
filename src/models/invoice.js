const mongoose = require("mongoose");

const InvoiceStatus = {
  DRAFT: "Draft",
  PENDING: "Pending",
  PAID: "Paid",
  PARTIAL_PAYMENT: "Partial_Payment",
  OVERDUE: "Overdue",
  CANCELLED: "Overdue",
  REJECTED: "Rejected",
  REFUNDED: "Refunded",
};

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
      enum: InvoiceStatus,
      default: InvoiceStatus.DRAFT,
    },
  },
  { timestamps: true }
);

const Invoice = mongoose.model("Invoice", InvoiceSchema);

module.exports = { Invoice, InvoiceStatus };
