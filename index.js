// Import dependencies
const express = require("express");
const mongoose = require("mongoose");
const admin = require("firebase-admin");
const cors = require("cors");
const bodyParser = require("body-parser");
const crypto = require("crypto");

// Initialize Express app
const app = express();
app.use(cors());
app.use(bodyParser.json());

// Firebase Client SDK configuration
const firebaseConfig = {
  apiKey: "AIzaSyCVePlFLC1fVxfBEUSpbiCDosjuKUw4-9g",
  authDomain: "invoices-f4033.firebaseapp.com",
  projectId: "invoices-f4033",
  storageBucket: "invoices-f4033.firebasestorage.app",
  messagingSenderId: "429530604490",
  appId: "1:429530604490:web:5dd4d8cbddb2d865582533",
};

admin.initializeApp(firebaseConfig);

const URI =
  "mongodb+srv://dbuser:PlAe86pdcBx6e48y@cluster0.nqdbi.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0";

// MongoDB connection
mongoose.connect(URI, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
});

const db = mongoose.connection;
db.on("error", console.error.bind(console, "MongoDB connection error:"));
db.once("open", () => {
  console.log("Connected to MongoDB");
});

// Define Mongoose schemas and models
const RecipientSchema = new mongoose.Schema({
  name: String,
  address: String,
  vat: String,
  email: String,
  userId: String,
});

const ItemSchema = new mongoose.Schema({
  label: String,
  quantity: Number,
  unitPrice: Number,
  vat: Number,
});

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
const InvoiceSchema = new mongoose.Schema({
  tag: String,
  description: String,
  date: Date,
  sender: {
    name: String,
    address: String,
    vat: String,
  },
  recipient: RecipientSchema,
  items: [ItemSchema],
  userId: String,
  status: {
    type: String,
    enum: INVOICE_STATUSES,
    default: INVOICE_STATUSES[0],
  },
});

const Recipient = mongoose.model("Recipient", RecipientSchema);
const Invoice = mongoose.model("Invoice", InvoiceSchema);

// Middleware to verify Firebase authentication token
const verifyFirebaseToken = async (req, res, next) => {
  const token = req.headers.authorization?.split(" ")[1];
  if (!token) {
    return res.status(401).send("Unauthorized");
  }

  try {
    const decodedToken = await admin.auth().verifyIdToken(token);
    req.user = decodedToken;
    next();
  } catch (error) {
    return res.status(401).send("Unauthorized");
  }
};

// Routes

// Create a new invoice
app.post("/invoices", verifyFirebaseToken, async (req, res) => {
  try {
    const recipient = await Recipient.findOne({
      _id: req.body.recipientId,
      userId: req.user.uid,
    });
    if (!recipient) {
      return res.status(404).send("Recipient not found");
    }
    const invoiceId = crypto.randomBytes(20).toString("hex");
    const invoice = new Invoice({
      ...req.body,
      invoiceId,
      userId: req.user.uid,
    });
    await invoice.save();
    res.status(201).send(invoice);
  } catch (error) {
    console.log(error);
    res.status(400).send(error);
  }
});

// Get a single invoice by ID
app.get("/invoices/:id", verifyFirebaseToken, async (req, res) => {
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
app.get("/invoices", verifyFirebaseToken, async (req, res) => {
  try {
    const invoices = await Invoice.find({ userId: req.user.uid });
    res.send(invoices);
  } catch (error) {
    res.status(400).send(error);
  }
});

// Update the status of an invoice
app.patch("/invoices/:id/status", verifyFirebaseToken, async (req, res) => {
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
app.patch("/invoices/:id", verifyFirebaseToken, async (req, res) => {
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
app.delete("/invoices/:id", verifyFirebaseToken, async (req, res) => {
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

// Get all invoices
app.get("/recipients", verifyFirebaseToken, async (req, res) => {
  try {
    const recipients = await Recipient.find({ userId: req.user.uid });
    res.send(recipients);
  } catch (error) {
    res.status(400).send(error);
  }
});

// Get a single recipient by ID
app.get("/recipients/:id", verifyFirebaseToken, async (req, res) => {
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
app.post("/recipients", verifyFirebaseToken, async (req, res) => {
  try {
    const recipientId = crypto.randomBytes(20).toString("hex");
    const recipient = new Recipient({
      ...req.body,
      recipientId,
      userId: req.user.uid,
    });
    await recipient.save();
    res.status(201).send(recipient);
  } catch (error) {
    res.status(400).send(error);
  }
});

// Update a recipient
app.patch("/recipients/:id", verifyFirebaseToken, async (req, res) => {
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
app.delete("/recipients/:id", verifyFirebaseToken, async (req, res) => {
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

// Start the server
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
