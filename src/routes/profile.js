const express = require("express");
const { userAuth } = require("../middlewares/auth");
const Group = require("../models/groups");
const Expense = require("../models/expense");

const profileRouter = express.Router();

profileRouter.get("/profile", userAuth, async (req, res) => {
  try {
    const user = req.user;
    return res.status(200).json({ data: user });
  } catch (err) {
    console.log(err);
    return res.status(500).json({ message: err });
  }
});

profileRouter.patch("/profile/update", userAuth, async (req, res) => {
  try {
    const user = req.user;
    const { firstName, lastName, email } = req.body;
    user.firstName = firstName;
    user.lastName = lastName;
    user.email = email;
    await user.save();
    return res.status(200).json({ data: user });
  } catch (err) {
    console.log(err);
    return res.status(500).json({ message: err });
  }
});

profileRouter.get("/profile/groups", userAuth, async (req, res) => {
  try {
    const user = req.user;
    const groups = await Group.find({ participants: { $in: [user.email] } });
    return res.status(200).json({ data: groups });
  } catch (err) {
    console.log(err);
    return res.status(500).json({ message: err });
  }
});

profileRouter.get("/profile/expenses", userAuth, async (req, res) => {
  try {
    const user = req.user;
    const expenses = await Expense.find({
      $or: [{ "paidBy.email": user.email }, { "owedBy.email": user.email }],
    }).populate("createdBy", ["firstName", "lastName", "email"]);

    return res.status(200).json({ data: expenses });
  } catch (err) {
    console.log(err);
    return res.status(500).json({ message: err });
  }
});

module.exports = profileRouter;
