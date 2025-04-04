const admin = require("firebase-admin");

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

module.exports = {
  verifyFirebaseToken,
};
