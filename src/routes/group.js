const express = require("express");
const { userAuth } = require("../middlewares/auth");
const Group = require("../models/groups");
const Expense = require("../models/expense");

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

    const participantsData = [...participants];

    admins.forEach((admin) => {
      if (participantsData.includes(admin)) {
        return;
      }
      participantsData.push(admin);
    });

    const newGroup = new Group({
      name,
      photoUrl,
      participants: participantsData,
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

groupRouter.get("/group/:groupId", userAuth, async (req, res) => {
  try {
    const groupId = req.params.groupId;
    const group = await Group.findById(groupId);
    return res.status(200).json({ data: group });
  } catch (err) {
    console.error(err);
    return res.status(500).json({ message: "Internal server error" });
  }
});

groupRouter.get("/group/:groupId/expenses", userAuth, async (req, res) => {
  try {
    const groupId = req.params.groupId;
    const expenses = await Expense.find({ groupId });
    return res.status(200).json({ data: expenses });
  } catch (err) {
    console.error(err);
    return res.status(500).json({ message: "Internal server error" });
  }
});

groupRouter.patch("/group/:groupId", userAuth, async (req, res) => {
  try {
    const groupId = req.params.groupId;
    const group = await Group.findById(groupId);
    if (!group) {
      return res.status(404).json({ message: "Group not found" });
    }

    const user = req.user;
    if (!group.admins.includes(user.email)) {
      return res.status(403).json({ message: "You are not an admin" });
    }

    const { name, photoUrl, participants, admins } = req.body;
    if (name) {
      group.name = name;
    }

    if (photoUrl) {
      group.photoUrl = photoUrl;
    }

    if (participants?.length > 0) {
      group.participants = participants;
    }

    if (admins?.length > 0) {
      group.admins = admins;

      admins.forEach((admin) => {
        if (group.participants.includes(admin)) {
          return;
        }
        group.participants.push(admin);
      });
    }

    await group.save();

    return res.status(200).json({ data: group });
  } catch (err) {
    console.error(err);
    return res.status(500).json({ message: "Internal server error" });
  }
});

module.exports = groupRouter;
