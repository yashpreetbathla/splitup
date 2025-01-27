const mongoose = require("mongoose");
const jwt = require("jsonwebtoken");
const bcrypt = require("bcrypt");

const UserSchema = new mongoose.Schema(
  {
    firstName: {
      type: String,
      required: true,
    },
    lastName: {
      type: String,
      required: true,
    },
    email: {
      type: String,
      required: true,
    },
    password: {
      type: String,
      required: true,
    },
    photoUrl: {
      type: String,
      default:
        "https://www.shutterstock.com/image-vector/default-avatar-profile-icon-transparent-600nw-2463868847.jpg",
    },
  },
  { timestamps: true }
);

UserSchema.methods.getJWT = async function () {
  const user = this;

  const token = await jwt.sign({ _id: user._id }, process.env.JWT_SECRET, {
    expiresIn: "24h",
  });

  return token;
};

UserSchema.methods.validatePassword = async function (passwordInputByUser) {
  const user = this;
  const isPasswordMatching = await bcrypt.compare(
    passwordInputByUser,
    user.password
  );
  return isPasswordMatching;
};

const User = mongoose.model("User", UserSchema);

module.exports = User;
