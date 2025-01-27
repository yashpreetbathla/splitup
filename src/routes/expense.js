const express = require("express");
const { userAuth } = require("../middlewares/auth");
const Expense = require("../models/expense");
const Group = require("../models/groups");
const calculateExpense = require("../utils/calculateExpense");

const expenseRouter = express.Router();

expenseRouter.post("/expense/create", userAuth, async (req, res) => {
  try {
    const { name, amount, groupId, paidBy, owedBy, status, currency } =
      req.body;

    const user = req.user;

    const group = await Group.findById(groupId);

    if (!group) {
      return res.status(404).json({ message: "Group not found" });
    }

    if (!group.participants.includes(user.email)) {
      return res
        .status(403)
        .json({ message: "You are not a participant of this group" });
    }

    const paidByAmount = paidBy.reduce((acc, curr) => acc + curr.amount, 0);
    const owedByAmount = owedBy.reduce((acc, curr) => acc + curr.amount, 0);

    const isCalculationCorrect =
      paidByAmount === owedByAmount && amount === paidByAmount;

    if (!isCalculationCorrect) {
      return res.status(400).json({ message: "Calculation is incorrect" });
    }

    const newExpense = new Expense({
      name,
      amount,
      groupId,
      paidBy,
      owedBy,
      status,
      currency,
      createdBy: user._id,
    });

    await newExpense.save();

    return res.status(200).json({ message: "Expense created successfully" });
  } catch (err) {
    console.error(err);
    return res.status(500).json({ message: "Internal server error" });
  }
});

expenseRouter.get("/expense/:expenseId", userAuth, async (req, res) => {
  const user = req.user;
  const expenseId = req.params.expenseId;
  const expense = await Expense.findById(expenseId);
  return res.status(200).json({ data: expense });
});

expenseRouter.get(
  "/expense/group/summary/:groupId",
  userAuth,
  async (req, res) => {
    const groupId = req.params.groupId;
    const expenses = await Expense.find({ groupId });

    const { userSet, totalPendingAmountArray } = calculateExpense(expenses);

    return res.status(200).json({
      data: { expenses, userSet, totalPendingAmountArray },
    });
  }
);

module.exports = expenseRouter;
