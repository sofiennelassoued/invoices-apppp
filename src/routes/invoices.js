const express = require("express");
const router = express.Router();
const { verifyFirebaseToken, verifyPayment } = require("../middlewares");
const { Recipient, Sender, Invoice } = require("../models");

// Create a new invoice
router.post("/", verifyFirebaseToken, verifyPayment, async (req, res) => {
  try {
    const sender = await Sender.findOne({
      _id: req.body.senderId,
      userId: req.user.uid,
    });
    if (!sender) {
      return res.status(404).send("Sender not found");
    }
    const recipient = await Recipient.findOne({
      _id: req.body.recipientId,
      userId: req.user.uid,
    });
    if (!recipient) {
      return res.status(404).send("Recipient not found");
    }
    const invoice = new Invoice({
      ...req.body,
      userId: req.user.uid,
    });
    await invoice.save();
    res.status(201).send(invoice);
  } catch (error) {
    res.status(400).send(error);
  }
});

// Get a single invoice by ID
router.get("/:id", verifyFirebaseToken, async (req, res) => {
  try {
    const invoice = await Invoice.findOne({
      _id: req.params.id,
      userId: req.user.uid,
    });
    if (!invoice) {
      return res.status(404).send("Invoice not found");
    }
    res.send(invoice);
  } catch (error) {
    res.status(400).send(error);
  }
});

// Get all invoices
router.get("/", verifyFirebaseToken, async (req, res) => {
  try {
    const invoices = await Invoice.find({ userId: req.user.uid });
    res.send(invoices);
  } catch (error) {
    res.status(400).send(error);
  }
});

// Update the status of an invoice
router.patch("/:id/status", verifyFirebaseToken, async (req, res) => {
  try {
    const { status } = req.body;

    if (!INVOICE_STATUSES.includes(status)) {
      return res.status(400).send("Invalid status");
    }

    const invoice = await Invoice.findOneAndUpdate(
      { _id: req.params.id, userId: req.user.uid },
      { status },
      { new: true }
    );

    if (!invoice) {
      return res.status(404).send("Invoice not found");
    }

    res.send(invoice);
  } catch (error) {
    res.status(400).send(error);
  }
});

// Update an invoice
router.patch("/:id", verifyFirebaseToken, async (req, res) => {
  try {
    const invoice = await Invoice.findOneAndUpdate(
      { _id: req.params.id, userId: req.user.uid },
      req.body,
      { new: true }
    );
    if (!invoice) {
      return res.status(404).send("Invoice not found");
    }
    res.send(invoice);
  } catch (error) {
    res.status(400).send(error);
  }
});

// Delete an invoice
router.delete("/:id", verifyFirebaseToken, async (req, res) => {
  try {
    const invoice = await Invoice.findOneAndDelete({
      _id: req.params.id,
      userId: req.user.uid,
    });
    if (!invoice) {
      return res.status(404).send("Invoice not found");
    }
    res.send(invoice);
  } catch (error) {
    res.status(400).send(error);
  }
});

module.exports = router;
