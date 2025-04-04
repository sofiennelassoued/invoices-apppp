const express = require("express");
const router = express.Router();
const { verifyFirebaseToken } = require("../middlewares");
const { Sender } = require("../models");

// Get all senders
router.get("/", verifyFirebaseToken, async (req, res) => {
  try {
    const senders = await Sender.find({ userId: req.user.uid });
    res.send(senders);
  } catch (error) {
    res.status(400).send(error);
  }
});

// Get a single sender by ID
router.get("/:id", verifyFirebaseToken, async (req, res) => {
  try {
    const sender = await Sender.findOne({
      _id: req.params.id,
      userId: req.user.uid,
    });
    if (!sender) {
      return res.status(404).send("Senders not found");
    }
    res.send(sender);
  } catch (error) {
    res.status(400).send(error);
  }
});

// Create a sender
router.post("/", verifyFirebaseToken, async (req, res) => {
  try {
    const sender = new Sender({
      ...req.body,
      userId: req.user.uid,
    });
    await sender.save();
    res.status(201).send(sender);
  } catch (error) {
    res.status(400).send(error);
  }
});

// Update a sender
router.patch("/:id", verifyFirebaseToken, async (req, res) => {
  try {
    const sender = await Sender.findOneAndUpdate(
      { _id: req.params.id, userId: req.user.uid },
      req.body,
      { new: true }
    );
    if (!sender) {
      return res.status(404).send("Sender not found");
    }
    res.send(sender);
  } catch (error) {
    res.status(400).send(error);
  }
});

// Delete a sender
router.delete("/:id", verifyFirebaseToken, async (req, res) => {
  try {
    const sender = await Sender.findOneAndDelete({
      _id: req.params.id,
      userId: req.user.uid,
    });
    if (!sender) {
      return res.status(404).send("Sender not found");
    }
    res.send(sender);
  } catch (error) {
    res.status(400).send(error);
  }
});

module.exports = router;
