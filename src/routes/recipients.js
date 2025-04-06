const express = require("express");
const router = express.Router();
const { verifyFirebaseToken, verifyPayment } = require("../middlewares");
const { Recipient } = require("../models");

// Get all recipients
router.get("/", verifyFirebaseToken, async (req, res) => {
  try {
    const { page = 1, limit = 10, name, email } = req.query;
    const filters = { userId: req.user.uid };

    if (name) {
      filters.name = { $regex: name, $options: "i" };
    }

    if (email) {
      filters.email = { $regex: email, $options: "i" };
    }
    const recipients = await Recipient.find(filters)
      .skip((page - 1) * limit)
      .limit(parseInt(limit))
      .sort({ createdAt: -1 });
    const total = await Recipient.countDocuments(filters);
    res.send({
      data: recipients,
      total,
      page: parseInt(page),
      limit: parseInt(limit),
      totalPages: Math.ceil(total / limit),
    });
  } catch (error) {
    res.status(400).send(error);
  }
});

// Get a single recipient by ID
router.get("/:id", verifyFirebaseToken, async (req, res) => {
  try {
    const recipient = await Recipients.findOne({
      _id: req.params.id,
      userId: req.user.uid,
    });
    if (!recipient) {
      return res.status(404).send("Recipients not found");
    }
    res.send(recipient);
  } catch (error) {
    res.status(400).send(error);
  }
});

// Create a recipient
router.post("/", verifyFirebaseToken, verifyPayment, async (req, res) => {
  try {
    const recipient = new Recipient({
      ...req.body,
      userId: req.user.uid,
    });
    await recipient.save();
    res.status(201).send(recipient);
  } catch (error) {
    res.status(400).send(error);
  }
});

// Update a recipient
router.patch("/:id", verifyFirebaseToken, async (req, res) => {
  try {
    const recipient = await Recipient.findOneAndUpdate(
      { _id: req.params.id, userId: req.user.uid },
      req.body,
      { new: true }
    );
    if (!recipient) {
      return res.status(404).send("Recipient not found");
    }
    res.send(recipient);
  } catch (error) {
    res.status(400).send(error);
  }
});

// Delete a recipient
router.delete("/:id", verifyFirebaseToken, async (req, res) => {
  try {
    const recipient = await Recipient.findOneAndDelete({
      _id: req.params.id,
      userId: req.user.uid,
    });
    if (!recipient) {
      return res.status(404).send("Recipient not found");
    }
    res.send(recipient);
  } catch (error) {
    res.status(400).send(error);
  }
});

module.exports = router;
