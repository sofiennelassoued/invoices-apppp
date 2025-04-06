const mongoose = require("mongoose");

const ProfileSchema = new mongoose.Schema(
  {
    name: String,
    address: String,
    email: String,
    _id: String,
  },
  { timestamps: true }
);

const Profile = mongoose.model("Profile", ProfileSchema);

module.exports = {
  Profile,
  ProfileSchema,
};
