const mongoose = require("mongoose");

const ExpenseObjSchema = new mongoose.Schema({
  email: {
    type: String,
    ref: "User",
    required: true,
  },
  amount: {
    type: Number,
    required: true,
  },
});

const ExpenseSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
  },
  amount: {
    type: Number,
    required: true,
  },
  groupId: {
    type: String,
    ref: "Group",
    required: true,
  },
  paidBy: [
    {
      type: ExpenseObjSchema,
      required: true,
    },
  ],
  owedBy: [
    {
      type: ExpenseObjSchema,
      required: true,
    },
  ],
  status: {
    type: String,
    enum: ["pending", "paid"],
    default: "pending",
  },
  currency: {
    type: String,
    default: "INR",
  },
  createdBy: {
    type: String,
    ref: "User",
    required: true,
  },
});

const Expense = mongoose.model("Expense", ExpenseSchema);

module.exports = Expense;
