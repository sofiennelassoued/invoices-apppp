const express = require("express");
const router = express.Router();
const { verifyFirebaseToken, verifyPayment } = require("../middlewares");
const { Recipient, Sender, Invoice, InvoiceStatus } = require("../models");

// Get all invoices
router.get("/", verifyFirebaseToken, async (req, res) => {
  try {
    const {
      page = 1,
      limit = 10,
      sender,
      recipient,
      status = InvoiceStatus.DRAFT,
      startDate,
      endDate,
      tag,
    } = req.query;
    const filters = { userId: req.user.uid };

    if (sender) {
      filters.sender = sender;
    }

    if (recipient) {
      filters.recipient = recipient;
    }

    if (status) {
      filters.status = { $regex: status, $options: "i" };
    }

    if (tag) {
      filters.tag = { $regex: tag, $options: "i" };
    }

    if (startDate && endDate) {
      filters.date = { $gte: startDate, $lt: endDate };
    } else if (startDate && !endDate) {
      filters.date = { $gte: startDate };
    } else if (!startDate && endDate) {
      filters.date = { $lt: endDate };
    }
    
    const invoices = await Invoice.find(filters)
      .skip((page - 1) * limit)
      .limit(parseInt(limit))
      .sort({ createdAt: -1 });
    const total = await Invoice.countDocuments(filters);
    res.send({
      data: invoices,
      total,
      page: parseInt(page),
      limit: parseInt(limit),
      totalPages: Math.ceil(total / limit),
    });
  } catch (error) {
    res.status(400).send(error);
  }
});

// Create a new invoice
router.post("/", verifyFirebaseToken, verifyPayment, async (req, res) => {
  try {
    const sender = await Sender.findById(req.body.senderId);
    if (!sender) {
      return res.status(404).send("Sender not found");
    }
    const recipient = await Recipient.findById(req.body.recipientId);
    if (!recipient) {
      return res.status(404).send("Recipient not found");
    }
    const invoice = new Invoice({
      ...req.body,
      sender: req.body.senderId,
      recipient: req.body.recipientId,
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
