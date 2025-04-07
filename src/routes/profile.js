const express = require("express");
const router = express.Router();
const { verifyFirebaseToken, verifyPayment } = require("../middlewares");
const { Profile } = require("../models");

// Get a single profile by ID
router.get("/", verifyFirebaseToken, async (req, res) => {
  try {
    const profile = await Profile.findById(req.user.uid);
    if (!profile) {
      return res.status(404).send("Profile not found");
    }
    res.send(profile);
  } catch (error) {
    res.status(400).send(error);
  }
});

// Create a profile
router.post("/", verifyFirebaseToken, verifyPayment, async (req, res) => {
  try {
    const profile = new Profile({
      ...req.body,
      _id: req.user.uid,
    });
    await profile.save();
    res.status(201).send(profile);
  } catch (error) {
    res.status(400).send(error);
  }
});

// Update a profile
router.patch("/", verifyFirebaseToken, async (req, res) => {
  try {
    const profile = await Profile.findByIdAndUpdate(req.user.uid, req.body, {
      new: true,
    });
    if (!profile) {
      return res.status(404).send("Profile not found");
    }
    res.send(profile);
  } catch (error) {
    res.status(400).send(error);
  }
});

// Delete a profile
router.delete("/", verifyFirebaseToken, async (req, res) => {
  try {
    const profile = await Profile.findByIdAndDelete(req.user.uid);
    if (!profile) {
      return res.status(404).send("Profile not found");
    }
    res.send(profile);
  } catch (error) {
    res.status(400).send(error);
  }
});

module.exports = router;
