const express = require("express");
const router = express.Router();
const { verifyFirebaseToken } = require("../middlewares");
const { Recipient } = require("../models");

// Get all recipients
router.get("/", verifyFirebaseToken, async (req, res) => {
  try {
    const recipients = await Recipient.find({ userId: req.user.uid });
    res.send(recipients);
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
router.post("/", verifyFirebaseToken, async (req, res) => {
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
