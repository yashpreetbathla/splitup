const calculateExpense = (expenses) => {
  const userSet = {};

  expenses.forEach((expense) => {
    expense.paidBy.forEach((paidBy) => {
      userSet[paidBy.email] = (userSet[paidBy.email] || 0) + paidBy.amount;
    });
    expense.owedBy.forEach((owedBy) => {
      userSet[owedBy.email] = (userSet[owedBy.email] || 0) - owedBy.amount;
    });
  });

  const positiveUserSet = {};
  const negativeUserSet = {};

  Object.keys(userSet).forEach((key) => {
    if (userSet[key] > 0) {
      positiveUserSet[key] = userSet[key];
    } else {
      negativeUserSet[key] = userSet[key];
    }
  });

  const positiveUserSetArray = Object.keys(positiveUserSet).map((key) => ({
    email: key,
    amount: positiveUserSet[key],
  }));

  const negativeUserSetArray = Object.keys(negativeUserSet).map((key) => ({
    email: key,
    amount: negativeUserSet[key],
  }));

  const sortedPositiveUserSetArray = positiveUserSetArray.sort(
    (a, b) => b.amount - a.amount
  );

  const sortedNegativeUserSetArray = negativeUserSetArray.sort(
    (a, b) => a.amount - b.amount
  );

  let totalPendingAmountArray = [];

  sortedPositiveUserSetArray.forEach((user) => {
    let userAmount = user.amount;

    sortedNegativeUserSetArray.forEach((negativeUser) => {
      let negAmount = -1 * negativeUser.amount;

      if (userAmount > negAmount) {
        userAmount = userAmount - negAmount;
        totalPendingAmountArray.push({
          fromUser: negativeUser.email,
          toUser: user.email,
          amount: negAmount,
        });
      } else if (userAmount <= negAmount) {
        negAmount = negAmount - userAmount;
        totalPendingAmountArray.push({
          fromUser: negativeUser.email,
          toUser: user.email,
          amount: userAmount,
        });
        negativeUser.amount = -1 * negAmount;
      }
    });
  });

  return { userSet, totalPendingAmountArray };
};

module.exports = calculateExpense;
