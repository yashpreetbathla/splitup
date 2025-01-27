const express = require("express");
const bcrypt = require("bcrypt");
const User = require("../models/user");

const authRouter = express.Router();

authRouter.post("/signup", async (req, res) => {
  const { firstName, lastName, email, password } = req.body;
  try {
    const user = await User.findOne({ email });

    if (user) {
      return res.status(400).json({ message: "User already exists" });
    }

    // Encrypting the password
    const passwordHash = await bcrypt.hash(password, 10).then((hash) => {
      return hash;
    });

    const newUser = new User({
      firstName,
      lastName,
      email,
      password: passwordHash,
    });

    const savedUser = await newUser.save();

    // Create JWT token
    const token = await newUser.getJWT();

    // Add the token to cookie and send the response back
    res.cookie("token", token, {
      expires: new Date(Date.now() + 8 * 3600000), // 8 hours
    });

    res
      .status(201)
      .json({ message: "User created successfully", data: savedUser });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Internal server error" });
  }
});

authRouter.post("/login", async (req, res) => {
  const { email, password } = req.body;

  const savedUser = await User.findOne({ email });

  if (savedUser) {
    const isPasswordCorrect = await savedUser.validatePassword(password);

    if (!isPasswordCorrect) {
      return res.status(400).json({ message: "Invalid credentials" });
    }

    const token = await savedUser.getJWT();

    res.cookie("token", token, { expires: new Date(Date.now() + 8 * 3600000) });

    return res
      .status(200)
      .json({ message: "User logged in successfully", data: savedUser });
  }

  return res.status(400).json({ message: "User not found" });
});

module.exports = authRouter;
