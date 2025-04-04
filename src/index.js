// Import dependencies
require("dotenv").config();
const express = require("express");
const mongoose = require("mongoose");
const admin = require("firebase-admin");
const cors = require("cors");
const bodyParser = require("body-parser");
const FIREBASE_CONFIG = require("./constants/firebase.config");
const { Invoices, Recipients, Senders } = require("./routes");

const {
  DATABASE_USER,
  DATABASE_PASSWORD,
  DATABASE_CLUSTER,
  DATABASE_APP_NAME,
} = process.env;

admin.initializeApp(FIREBASE_CONFIG);

// Initialize Express app
const app = express();
app.use(cors());
app.use(bodyParser.json());

const URI = `mongodb+srv://${DATABASE_USER}:${DATABASE_PASSWORD}@${DATABASE_CLUSTER}/?retryWrites=true&w=majority&appName=${DATABASE_APP_NAME}`;

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

// Routes
app.use("/senders", Senders);
app.use("/recipients", Recipients);
app.use("/invoices", Invoices);

// Start the server
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
