const express = require("express");
const { userAuth } = require("../middlewares/auth");
const Group = require("../models/groups");
const Expense = require("../models/expense");

const profileRouter = express.Router();

profileRouter.get("/profile", userAuth, async (req, res) => {
  const user = req.user;
  return res.status(200).json({ data: user });
});

profileRouter.get("/profile/groups", userAuth, async (req, res) => {
  const user = req.user;
  const groups = await Group.find({ participants: { $in: [user.email] } });
  return res.status(200).json({ data: groups });
});

profileRouter.get("/profile/expenses", userAuth, async (req, res) => {
  const user = req.user;
  const expenses = await Expense.find({
    $or: [{ "paidBy.email": user.email }, { "owedBy.email": user.email }],
  }).populate("createdBy", ["firstName", "lastName", "email"]);

  return res.status(200).json({ data: expenses });
});

module.exports = profileRouter;
