const db = require('../config/database');

const createBudget = async (req, res) => {
    const { user_id, period, start_date, end_date, allocated_amount, spent_amount } = req.body;
    try {
        const [result] = await db.execute(
            'INSERT INTO Budget (user_id, period, start_date, end_date, allocated_amount, spent_amount) VALUES (?, ?, ?, ?, ?, ?)',
            [user_id, period, start_date, end_date, allocated_amount, spent_amount || 0]
        );
        res.status(201).json({ id: result.insertId, user_id, period, start_date, end_date, allocated_amount, spent_amount: spent_amount || 0 });
    } catch (error) {
        res.status(400).json({ error: error.message });
    }
};

const getBudgetsByUser = async (req, res) => {
    const { userId } = req.params;
    try {
        const [budgets] = await db.execute('SELECT * FROM Budget WHERE user_id = ?', [userId]);
        res.status(200).json(budgets);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

// controllers/budgetController.js
const updateUserBudget = async (req, res) => {
  const { userId } = req.params;
  const { spent_amount } = req.body;

  try {
    console.log("Update budget request received for user ID:", userId);
    console.log("Received spent_amount:", spent_amount);

    // Convert spent_amount to a float
    let spentAmount = parseFloat(spent_amount);
    if (isNaN(spentAmount)) {
      throw new Error("Invalid spent_amount value");
    }

    // Fetch the user's current budget
    const [budget] = await db.execute(
      "SELECT * FROM Budget WHERE user_id = ? AND NOW() BETWEEN start_date AND end_date",
      [userId]
    );

    if (budget.length > 0) {
      const userBudget = budget[0];
      console.log("Current spent_amount in DB:", userBudget.spent_amount);

      // Update the budget with the new spent amount
      let newSpentAmount = parseFloat(userBudget.spent_amount) + spentAmount;
      console.log("New spent_amount to be set:", newSpentAmount);

      const [result] = await db.execute(
        `UPDATE Budget
         SET spent_amount = ?
         WHERE user_id = ? AND NOW() BETWEEN start_date AND end_date`,
        [newSpentAmount, userId]
      );

      if (result.affectedRows > 0) {
        // Fetch the updated budget to return
        const [updatedBudget] = await db.execute(
          "SELECT * FROM Budget WHERE user_id = ? AND NOW() BETWEEN start_date AND end_date",
          [userId]
        );

        const currentBudget = updatedBudget.length > 0 ? updatedBudget[0] : null;

        console.log("Budget updated successfully for user ID:", userId);

        res.json({
          period: currentBudget.period,
          startDate: currentBudget.start_date,
          endDate: currentBudget.end_date,
          allocatedAmount: currentBudget.allocated_amount,
          spentAmount: currentBudget.spent_amount,
        });
      } else {
        console.error("No rows affected during budget update for user ID:", userId);
        res.status(400).json({ error: "Budget update failed" });
      }
    } else {
      console.error("Budget not found for user ID:", userId);
      res.status(404).json({ error: "Budget not found" });
    }
  } catch (error) {
    console.error("Internal Server Error:", error.message);
    res.status(500).json({ error: "Internal Server Error" });
  }
}





module.exports = {
    createBudget,
    getBudgetsByUser,
    updateUserBudget
};
