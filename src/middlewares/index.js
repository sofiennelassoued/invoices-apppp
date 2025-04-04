const { verifyFirebaseToken } = require("./authorization");
const { verifyPayment } = require("./payment");

module.exports = {
  verifyFirebaseToken,
  verifyPayment,
};
