// Middleware payment
const verifyPayment = async (req, res, next) => {
  // console.info(req.user)
  const paid = true;

  try {
    if (!paid) new Error("Unpaid");
    next()
  } catch (error) {
    return res.status(401).send(error.message);
  }
};

module.exports = {
  verifyPayment,
};
