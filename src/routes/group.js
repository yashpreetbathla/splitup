const express = require("express");
const { userAuth } = require("../middlewares/auth");
const Group = require("../models/groups");

const groupRouter = express.Router();

groupRouter.post("/group/create", userAuth, async (req, res) => {
  try {
    const { name, photoUrl, participants, admins } = req.body;

    const user = req.user;

    if (!participants.includes(user.email)) {
      return res.status(400).json({ message: "You are not a participant" });
    }

    if (admins.length === 0) {
      return res.status(400).json({ message: "Admins are required" });
    }

    const newGroup = new Group({
      name,
      photoUrl,
      participants,
      admins,
      createdBy: user._id,
    });

    const newGroupData = await newGroup.save();

    return res
      .status(200)
      .json({ message: "Group created successfully", data: newGroupData });
  } catch (err) {
    console.error(err);
    return res.status(500).json({ message: "Internal server error" });
  }
});

module.exports = groupRouter;
